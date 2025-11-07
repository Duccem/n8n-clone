import { createAuthClient } from "better-auth/client";
import { emailOTPClient, organizationClient } from "better-auth/client/plugins";
import { polarClient } from "@polar-sh/better-auth";
import { lastLoginMethod } from "better-auth/plugins";

export const authClient = createAuthClient({
  plugins: [
    organizationClient(),
    polarClient(),
    emailOTPClient(),
    lastLoginMethod(),
  ],
});

export const {
  useSession,
  useActiveMemberRole,
  useActiveMember,
  useActiveOrganization,
  useListOrganizations,
} = authClient;

