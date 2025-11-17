import { authenticated } from "@/lib/api";
import { database } from "@/lib/database";
import { connection, node, workflow } from "@/lib/database/schema/workflow";
import { and, count, desc, eq, like, SQL, sql } from "drizzle-orm";
import { AnyPgColumn } from "drizzle-orm/pg-core";

import z from "zod";
import { NodeType } from "@/features/editor/types/node";
import { inngest } from "@/lib/inngest";

const createWorkflow = authenticated
  .route({ method: "POST", path: "/" })
  .input(
    z.object({
      name: z.string().min(1, "Workflow name is required"),
    })
  )
  .handler(async ({ input, context }) => {
    const newWorkflow = await database
      .insert(workflow)
      .values({
        name: input.name,
        organizationId: context.organization.id,
      })
      .returning();

    await database.insert(node).values({
      type: NodeType.INITIAL,
      position: { x: 0, y: 0 },
      name: NodeType.INITIAL,
      workflowId: newWorkflow[0].id,
      data: {
        label: "Start",
      },
    });
  });

const updateWorkflow = authenticated
  .route({ method: "PUT", path: "/:workflowId" })
  .input(
    z.object({
      workflowId: z.string(),
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

const updateNodesWorkflow = authenticated
  .route({ method: "PUT", path: "/:workflowId/nodes" })
  .input(
    z.object({
      workflowId: z.string(),
      nodes: z.array(
        z.object({
          id: z.uuid(),
          type: z
            .enum([
              "initial",
              "manual_trigger",
              "http_request",
              "webhook",
              "form_trigger",
              "schedule_trigger",
              "ai_processing",
              "function",
              "set",
            ])
            .nullish(),
          data: z.record(z.string(), z.any()),
          position: z.object({
            x: z.number(),
            y: z.number(),
          }),
        })
      ),
      edges: z.array(
        z.object({
          source: z.string(),
          target: z.string(),
          sourceHandle: z.string().nullish(),
          targetHandle: z.string().nullish(),
        })
      ),
    })
  )
  .handler(async ({ input, context }) => {
    const { edges, nodes, workflowId } = input;

    const existingWorkflow = await database.query.workflow.findFirst({
      where: and(
        eq(workflow.id, workflowId),
        eq(workflow.organizationId, context.organization.id)
      ),
    });

    if (!existingWorkflow) {
      throw new Error("Workflow not found");
    }
    await database
      .delete(connection)
      .where(eq(connection.workflowId, workflowId));
    await database.delete(node).where(eq(node.workflowId, workflowId));

    await database.insert(node).values(
      nodes.map((nodeItem) => ({
        id: nodeItem.id,
        workflowId,
        type: nodeItem.type ?? "initial",
        data: nodeItem.data,
        position: nodeItem.position,
        name: nodeItem.data.label ?? "Unnamed Node",
      }))
    );

    await database.insert(connection).values(
      edges.map((edgeItem) => ({
        workflowId,
        sourceNodeId: edgeItem.source,
        targetNodeId: edgeItem.target,
        sourceOutput: edgeItem.sourceHandle ?? "main",
        targetInput: edgeItem.targetHandle ?? "main",
      }))
    );

    await database
      .update(workflow)
      .set({ updatedAt: new Date() })
      .where(eq(workflow.id, workflowId));
  });

export const removeWorkflow = authenticated
  .route({ method: "DELETE", path: "/:workflowId" })
  .input(
    z.object({
      workflowId: z.string().uuid(),
    })
  )
  .handler(async ({ input, context }) => {
    await database.delete(node).where(eq(node.workflowId, input.workflowId));
    await database
      .delete(connection)
      .where(eq(connection.workflowId, input.workflowId));
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
      workflowId: z.uuid(),
    })
  )
  .handler(async ({ input, context }) => {
    const workflowItem = await database.query.workflow.findFirst({
      where: and(
        eq(workflow.id, input.workflowId),
        eq(workflow.organizationId, context.organization.id)
      ),
      with: {
        nodes: true,
        connections: true,
      },
    });
    return { workflow: workflowItem };
  });

const executeWorkflow = authenticated
  .route({ method: "POST", path: "/:workflowId/execute" })
  .input(
    z.object({
      workflowId: z.uuid(),
    })
  )
  .handler(async ({ input, context }) => {
    const existingWorkflow = await database.query.workflow.findFirst({
      where: and(
        eq(workflow.id, input.workflowId),
        eq(workflow.organizationId, context.organization.id)
      ),
    });

    if (!existingWorkflow) {
      throw new Error("Workflow not found");
    }

    await inngest.send({
      name: "workflows/execute.workflow",
      data: {
        workflowId: existingWorkflow.id,
        organizationId: existingWorkflow.organizationId,
      },
    });
  });

export const workflowsRouter = authenticated.prefix("/workflow").router({
  createWorkflow,
  updateWorkflow,
  removeWorkflow,
  listWorkflows,
  getWorkflow,
  updateNodesWorkflow,
});

