import type { z, ZodType } from "zod";

export type AppError<Code extends string = string, Data = unknown> = Error & {
  code: Code;
  status: number;
  data?: Data;
};

export type AppErrorShape<
  Code extends string = string,
  Data extends ZodType | undefined = undefined
> = {
  code: Code;
  status: number;
  schema?: Data;
  defaultMessage?: string;
};

export function defineAppError<
  Code extends string,
  Data extends ZodType | undefined = undefined
>(params: AppErrorShape<Code, Data>) {
  return (
    data?: Data extends ZodType ? z.infer<Data> : undefined,
    message?: string
  ): AppError<Code, Data extends ZodType ? z.infer<Data> : undefined> => {
    const parsed = params.schema
      ? (params.schema as ZodType<any>).parse(data)
      : data;
    const error = new Error(
      message || params.defaultMessage || "An error occurred"
    ) as AppError<Code, Data extends ZodType ? z.infer<Data> : undefined>;
    error.code = params.code;
    error.status = params.status;
    if (parsed !== undefined) {
      error.data = parsed;
    }
    return error;
  };
}

export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "status" in error &&
    typeof (error as any).code === "string" &&
    typeof (error as any).status === "number"
  );
}
