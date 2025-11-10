import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { onError } from "@orpc/server";

const handler = new OpenAPIHandler(
  {},
  {
    interceptors: [
      onError((error) => {
        console.error(error);
      }),
    ],
  }
);

async function handleRequest(request: Request) {
  const { response } = await handler.handle(request, {
    prefix: "/api/v1",
    context: {}, // Provide initial context if needed
  });

  return response ?? new Response("Not found", { status: 404 });
}

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;

