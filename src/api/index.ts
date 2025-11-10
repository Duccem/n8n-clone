import { auth } from "@/lib/auth/auth";
import { polarClient } from "@/lib/payments";
import { ORPCError, os } from "@orpc/server";
import { headers } from "next/headers";

export const base = os.$context();

export const authenticated = base.use(async ({ context, next }) => {
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
  const data = await polarClient.subscriptions.list({
    metadata: { referenceId: context.organization.id },
  });
  if (
    !data ||
    data.result.items.length === 0 ||
    data.result.items[0].status !== "active"
  ) {
    throw new ORPCError("FORBIDDEN");
  }

  return next({
    context: {
      subscription: data.result.items[0],
    },
  });
});

