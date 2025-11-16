import {
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { organization } from "./auth";
import { relations } from "drizzle-orm";

export const workflow = pgTable("workflow", {
  id: uuid("id").primaryKey().$defaultFn(v7),
  name: text("name").notNull(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organization.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  state: text("state").notNull().default("active"),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$defaultFn(() => new Date()),
});

export const node_type = pgEnum("node_type", [
  "initial",
  "manual_trigger",
  "http_request",
]);

export const node = pgTable("node", {
  id: uuid("id").primaryKey().$defaultFn(v7),
  workflowId: uuid("workflow_id")
    .notNull()
    .references(() => workflow.id),
  name: text("name").notNull(),
  type: node_type("type").default("initial").notNull(),
  position: json("position").notNull(),
  data: json("data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$defaultFn(() => new Date()),
});

export const connection = pgTable("connection", {
  id: uuid("id").primaryKey().$defaultFn(v7),
  workflowId: uuid("workflow_id")
    .notNull()
    .references(() => workflow.id, { onDelete: "cascade" }),
  sourceNodeId: uuid("source_node_id")
    .notNull()
    .references(() => node.id),
  targetNodeId: uuid("target_node_id")
    .notNull()
    .references(() => node.id),
  sourceOutput: text("source_output").default("main").notNull(),
  targetInput: text("target_input").default("main").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$defaultFn(() => new Date()),
});

export const workflow_relations = relations(workflow, ({ many }) => ({
  nodes: many(node),
  connections: many(connection),
}));

export const node_relations = relations(node, ({ one, many }) => ({
  workflow: one(workflow, {
    fields: [node.workflowId],
    references: [workflow.id],
  }),
  outputConnections: many(connection, { relationName: "output_node" }),
  inputConnections: many(connection, { relationName: "input_node" }),
}));

export const connection_relations = relations(connection, ({ one }) => ({
  workflow: one(workflow, {
    fields: [connection.workflowId],
    references: [workflow.id],
  }),
  sourceNode: one(node, {
    fields: [connection.sourceNodeId],
    references: [node.id],
  }),
  targetNode: one(node, {
    fields: [connection.targetNodeId],
    references: [node.id],
  }),
}));

