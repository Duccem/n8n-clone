import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { database } from "../database";
import * as schema from "@/lib/database/schema/auth";
import {
  bearer,
  emailOTP,
  lastLoginMethod,
  openAPI,
  organization,
} from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { ac, admin, member } from "./roles";
import {
  checkout,
  polar,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";
import { polarClient } from "../payments";
import { products } from "../payments/products";
import { cache } from "react";
import { headers } from "next/headers";

export const auth = betterAuth({
  database: drizzleAdapter(database, {
    provider: "pg",
    schema,
  }),
  secret: process.env.BETTER_AUTH_SECRET || "",
  trustedOrigins: [process.env.CORS_ORIGIN || ""],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirectURI: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`,
    },
    github: {
      enabled: true,
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      enableCustomerPortal: true,
      use: [
        checkout({
          products,
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
          theme: "dark",
        }),
        portal({
          returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/settings/billing`,
        }),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET || "",
          onPayload: async ({ data, timestamp, type }) =>
            console.log({ data, timestamp, type }),
        }),
        usage(),
      ],
    }),
    organization({
      ac,
      roles: {
        admin,
        member,
      },
      sendInvitationEmail: async ({ email, invitation, role }) =>
        console.log({ email, invitation, role }),
      organizationHooks: {
        afterAcceptInvitation: async ({
          invitation,
          user,
          member,
          organization,
        }) => console.log({ invitation, user, member, organization }),
      },
    }),
    emailOTP({
      otpLength: 6,
      expiresIn: 10 * 60,
      sendVerificationOnSignUp: true,
      allowedAttempts: 5,
      sendVerificationOTP: async ({ email, otp, type }) =>
        console.log({ email, otp, type }),
    }),
    nextCookies(),
    lastLoginMethod(),
    bearer(),
    openAPI(),
  ],
});

export type BetterSession = typeof auth.$Infer.Session;
export type BetterUser = typeof auth.$Infer.Session.user;
export type BetterOrganization = typeof auth.$Infer.Organization;
export type BetterMember = typeof auth.$Infer.Member;
export type BetterInvitation = typeof auth.$Infer.Invitation;

