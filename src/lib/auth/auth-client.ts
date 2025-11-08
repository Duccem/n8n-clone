import { createAuthClient } from "better-auth/react";
import {
  emailOTPClient,
  organizationClient,
  lastLoginMethodClient,
} from "better-auth/client/plugins";
import { polarClient } from "@polar-sh/better-auth";

export const authClient = createAuthClient({
  plugins: [
    organizationClient(),
    polarClient(),
    emailOTPClient(),
    lastLoginMethodClient(),
  ],
});

