import { Checkout } from "@polar-sh/nextjs";
export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN ?? "",
  successUrl: process.env.POLAR_SUCCESS_URL ?? "",
  returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/organization/billing`,
  server: "sandbox",
  theme: "dark",
});

