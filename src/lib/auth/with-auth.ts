import { type NextRequest } from "next/server";
import z, { ZodError, type ZodType } from "zod";
import {
  AppError,
  AppErrorShape,
  defineAppError,
  isAppError,
} from "../types/app-error";
import { auth, BetterSession, getSession } from "./auth";
import { AppResponse } from "../types/app-response";
import { headers } from "next/headers";

const ROLES = ["admin", "therapist", "patient"] as const;
type Role = (typeof ROLES)[number];

// Mapea shapes -> factories tipadas
type ErrorFactoriesFromShapes<
  S extends Record<string, AppErrorShape<string, ZodType | undefined>>
> = {
  [K in keyof S]: (
    data?: S[K]["schema"] extends ZodType ? z.infer<S[K]["schema"]> : undefined,
    message?: string
  ) => AppError<
    S[K]["code"],
    S[K]["schema"] extends ZodType ? z.infer<S[K]["schema"]> : undefined
  >;
};

export type ErrorsConf = Record<
  string,
  AppErrorShape<string, ZodType | undefined>
>;

export type AuthHandlerContext<
  P,
  B,
  Q,
  Authenticated extends boolean | undefined,
  E extends ErrorsConf = {}
> = {
  request: NextRequest;
  params: P;
  body: B;
  queryParams: Q;
  errors: ErrorFactoriesFromShapes<E>;
} & (Authenticated extends undefined | true ? { session: BetterSession } : {});

export type AuthenticatedHandler<
  P,
  B,
  Q,
  O,
  Authenticated extends boolean | undefined,
  E extends ErrorsConf = {}
> = (
  context: AuthHandlerContext<P, B, Q, Authenticated, E>
) => Promise<O | void>;

export type AuthenticatedHandlerOptions<
  P,
  B,
  Q,
  O,
  Authenticated extends boolean | undefined,
  E extends ErrorsConf = {}
> = {
  bodySchema?: ZodType<B>;
  querySchema?: ZodType<Q>;
  paramsSchema?: ZodType<P>;
  responseSchema?: ZodType<O>;
  handler: AuthenticatedHandler<P, B, Q, O, Authenticated, E>;
  roles?: Role[];
  errors?: E;
  authenticated?: Authenticated;
};

export const withAuth = <
  P,
  B,
  Q,
  O,
  Authenticated extends boolean | undefined = true,
  E extends ErrorsConf = {}
>(
  options: AuthenticatedHandlerOptions<P, B, Q, O, Authenticated, E>
) => {
  let definedErrors = {} as ErrorFactoriesFromShapes<E>;
  if (options.errors) {
    for (const key in options.errors) {
      const shape = options.errors[key] as AppErrorShape<string, ZodType>;
      (definedErrors as any)[key] = defineAppError(shape as any) as any;
    }
  }
  return async (req: NextRequest, { params }: { params: Promise<P> }) => {
    const baseContext = {} as AuthHandlerContext<P, B, Q, Authenticated, E>;

    if (options.authenticated !== false) {
      const session = await getSession();
      if (!session) {
        return AppResponse.genericError("Unauthorized", 401);
      }

      if (options.roles) {
        const { role } = await auth.api.getActiveMemberRole({
          headers: await headers(),
        });
        if (!role || !options.roles.includes(role as Role)) {
          return AppResponse.genericError("Forbidden", 403);
        }
      }
      (baseContext as any).session = session;
    }

    const parsedBody = await parseBody<B>(req, options?.bodySchema);
    const parsedParams = await parseParams<P>(params, options?.paramsSchema);
    const parsedQuery = await parseQueryParams<Q>(req, options?.querySchema);

    const context: AuthHandlerContext<P, B, Q, Authenticated, E> = {
      ...baseContext,
      request: req,
      body: parsedBody,
      params: parsedParams,
      queryParams: parsedQuery,
      errors: definedErrors,
    };

    try {
      const response = await options.handler(context);
      if (typeof response === "undefined") {
        return AppResponse.ok();
      }

      if (options.responseSchema) {
        const validatedResponse = options.responseSchema.parse(response);
        return AppResponse.json(validatedResponse);
      }

      return AppResponse.json(response);
    } catch (error) {
      console.error("Error in authenticated handler:", error);
      switch (true) {
        case error instanceof ZodError: {
          const zodError = error as ZodError;
          return AppResponse.genericError(zodError.message, 400);
        }

        case isAppError(error): {
          const appError = error as AppError;
          return AppResponse.domainError(appError, appError.status);
        }

        default:
          return AppResponse.internalServerError();
      }
    }
  };
};

async function parseBody<B>(req: NextRequest, schema?: ZodType<B>): Promise<B> {
  if (req.method === "GET" || req.method === "HEAD") {
    return {} as B; // No body for GET or HEAD requests
  }
  if (!schema) {
    try {
      const data = await req.json();
      return data as B;
    } catch (_error) {
      return {} as B;
    }
  }
  return schema.parse(await req.json());
}

async function parseParams<P>(
  params: Promise<P>,
  schema?: ZodType<P>
): Promise<P> {
  const resolvedParams = await params;
  if (!schema) {
    return resolvedParams;
  }
  return schema.parse(resolvedParams);
}

function parseQueryParams<Q>(req: NextRequest, schema?: ZodType<Q>): Q {
  if (!schema) {
    return Object.fromEntries(req.nextUrl.searchParams.entries()) as Q;
  }
  return schema.parse(Object.fromEntries(req.nextUrl.searchParams.entries()));
}

