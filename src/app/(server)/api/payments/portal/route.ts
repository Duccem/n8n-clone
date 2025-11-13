import { auth } from "@/lib/auth/auth";
import { polarClient } from "@/lib/payments";
import { CustomerPortal } from "@polar-sh/nextjs";
import { headers } from "next/headers";

export const GET = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN ?? "",
  getCustomerId: async (req) => {
    const org = await auth.api.getFullOrganization({
      headers: await headers(),
      query: {
        membersLimit: 0,
      },
    });
    const customer = await polarClient.customers.getExternal({
      externalId: org!.id,
    });

    return customer.id;
  },
  returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/organization/billing`,
  server: "sandbox",
});

