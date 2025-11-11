import { auth } from "@/lib/auth/auth";
import { polarClient } from "@/lib/payments";
import { ORPCError, os } from "@orpc/server";
import { headers } from "next/headers";

export const base = os.$route({ inputStructure: "compact" });

export const authenticated = base.use(async ({ next }) => {
  const data = await auth.api.getSession({
    headers: await headers(),
  });
  if (!data || !data.session) {
    throw new ORPCError("UNAUTHORIZED");
  }

  const activeOrganization = await auth.api.getFullOrganization({
    headers: await headers(),
    query: { membersLimit: 0 },
  });

  if (!activeOrganization) {
    throw new ORPCError("FORBIDDEN");
  }

  return next({
    context: {
      session: data.session,
      user: data.user,
      organization: activeOrganization,
    },
  });
});

export const premium = authenticated.use(async ({ context, next }) => {
  const data = await polarClient.customers.getState({
    id: context.user.id,
  });

  if (!data || data.activeSubscriptions.length === 0) {
    throw new ORPCError("FORBIDDEN");
  }

  return next({
    context: { ...context, subscription: data.activeSubscriptions[0] },
  });
});

