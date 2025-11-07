import { NextResponse } from "next/server";
import type { AppError } from "./app-error";

export class AppResponse {
  static domainError(error: AppError, statusCode: number): NextResponse {
    return NextResponse.json(
      {
        message: error.message,
        code: error.code,
        data: error.data || {},
      },
      { status: statusCode }
    );
  }

  static ok(): NextResponse {
    return NextResponse.json({ message: "Ok" }, { status: 200 });
  }

  static internalServerError(): NextResponse {
    return NextResponse.json(
      {
        code: "InternalServerError",
        message: "Internal server error",
        data: {},
      },
      { status: 500 }
    );
  }

  static created(): NextResponse {
    return new NextResponse(null, { status: 201 });
  }

  static json<JsonBody>(data: JsonBody): NextResponse {
    return NextResponse.json(data, { status: 200 });
  }

  static genericError(message: string, statusCode: number): NextResponse {
    return NextResponse.json(
      {
        error: {
          code: "GenericError",
          message,
          data: {},
        },
      },
      { status: statusCode }
    );
  }
}

