import { withAuth } from "@/lib/auth/with-auth";
import { database } from "@/lib/database";
import { workflow } from "@/lib/database/schema/workflow";
import z from "zod";

export const GET = withAuth({
  handler: async () => {
    const workflows = await database.query.workflow.findMany();
    return {
      items: workflows,
    };
  },
});

export const POST = withAuth({
  bodySchema: z.object({
    name: z.string().min(1).max(255),
  }),
  handler: async ({ body: { name } }) => {
    await database.insert(workflow).values({ name }).returning();
  },
});

