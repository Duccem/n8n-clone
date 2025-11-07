import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest } from "next/server";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "es"],
  defaultLocale: "en",
  urlMappingStrategy: "rewriteDefault",
});

export function proxy(request: NextRequest) {
  console.log("I18nMiddleware called");
  return I18nMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|tasks|webhooks|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|yml|json)$).*)",
  ],
};

