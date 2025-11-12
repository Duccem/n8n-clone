import { database } from "@/lib/database";
import { inngest } from "@/lib/inngest";
import { polarClient } from "@/lib/payments";

export const createCustomerForOrganization = inngest.createFunction(
  { id: "create-customer-org", retries: 0 },
  { event: "organization.created" },
  async ({ event, step }) => {
    const { organizationId } = event.data;

    const organization = await step.run("get-organization", async () => {
      const org = await database.query.organization.findFirst({
        where: (org, { eq }) => eq(org.id, organizationId),
      });
      if (!org) throw new Error("Organization not found");
      return org;
    });

    await step.run("create-customer", async () => {
      await polarClient.customers.create({
        organizationId: "e7f652aa-4f61-400d-bbd0-96a16540eae9",
        email: "",
        name: organization.name,
        externalId: organization.id,
      });
    });
  }
);

