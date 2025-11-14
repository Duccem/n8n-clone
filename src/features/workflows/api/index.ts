import { authenticated } from "@/lib/api";
import { database } from "@/lib/database";
import { workflow } from "@/lib/database/schema/workflow";
import { and, count, desc, eq, like, SQL, sql } from "drizzle-orm";
import { AnyPgColumn } from "drizzle-orm/pg-core";
import z from "zod";

const createWorkflow = authenticated
  .route({ method: "POST", path: "/" })
  .input(
    z.object({
      name: z.string().min(1, "Workflow name is required"),
    })
  )
  .handler(async ({ input, context }) => {
    await database.insert(workflow).values({
      name: input.name,
      organizationId: context.organization.id,
    });
  });

const updateWorkflow = authenticated
  .route({ method: "PUT", path: "/:workflowId" })
  .input(
    z.object({
      workflowId: z.string().uuid(),
      name: z.string().min(1, "Workflow name is required"),
    })
  )
  .handler(async ({ input, context }) => {
    await database
      .update(workflow)
      .set({
        name: input.name,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(workflow.id, input.workflowId),
          eq(workflow.organizationId, context.organization.id)
        )
      );
  });

export const removeWorkflow = authenticated
  .route({ method: "DELETE", path: "/:workflowId" })
  .input(
    z.object({
      workflowId: z.string().uuid(),
    })
  )
  .handler(async ({ input, context }) => {
    await database
      .delete(workflow)
      .where(
        and(
          eq(workflow.id, input.workflowId),
          eq(workflow.organizationId, context.organization.id)
        )
      );
  });

export const listWorkflows = authenticated
  .route({ method: "GET", path: "/" })
  .input(
    z.object({
      page: z.coerce.number().min(1).default(1),
      pageSize: z.coerce.number().min(1).max(100).default(10),
      query: z.string().optional(),
      state: z.string().optional(),
    })
  )
  .handler(async ({ context, input }) => {
    const { page, pageSize } = input;
    const queryFilters: Array<any> = [];

    if (input.query) {
      queryFilters.push(
        like(lower(workflow.name), `%${input.query.toLowerCase()}%`)
      );
    }

    if (input.state) {
      queryFilters.push(eq(workflow.state, input.state));
    }
    const workflowsSelect = database
      .select()
      .from(workflow)
      .where(
        and(
          eq(workflow.organizationId, context.organization.id),
          ...queryFilters
        )
      )
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(desc(workflow.createdAt));
    const workflowsCount = database
      .select({ count: count(workflow.id) })
      .from(workflow)
      .where(
        and(
          eq(workflow.organizationId, context.organization.id),
          ...queryFilters
        )
      );

    const [workflows, totalCountResult] = await Promise.all([
      workflowsSelect,
      workflowsCount,
    ]);

    const totalCount = totalCountResult[0]?.count ?? 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      workflows,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages,
        previousPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
      },
    };
  });

export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}

const getWorkflow = authenticated
  .route({ method: "GET", path: "/:workflowId" })
  .input(
    z.object({
      workflowId: z.string().uuid(),
    })
  )
  .handler(async ({ input, context }) => {
    const workflowItem = await database
      .select()
      .from(workflow)
      .where(
        and(
          eq(workflow.id, input.workflowId),
          eq(workflow.organizationId, context.organization.id)
        )
      )
      .limit(1)
      .then((res) => res[0] || null);

    return { workflow: workflowItem };
  });

export const workflowsRouter = authenticated.prefix("/workflow").router({
  createWorkflow,
  updateWorkflow,
  removeWorkflow,
  listWorkflows,
  getWorkflow,
});

