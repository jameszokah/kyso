import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import type { WorkflowBuilderReactFlowJson } from "@kyso/types/common";

// Use crypto.randomUUID for generating IDs (built-in, no external deps)
const generateId = () => crypto.randomUUID();

// =============================================================================
// Workflow Table
// =============================================================================

/**
 * Main workflow table storing the canvas data (nodes/edges) and settings.
 * Supports soft delete for recoverability.
 */
export const workflow = pgTable(
  "workflow",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    name: text("name").notNull().default("Untitled Workflow"),
    description: text("description"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    /**
     * Canvas data: { nodes: Node[], edges: Edge[], viewport: Viewport }
     * This is the React Flow graph data that the user builds.
     * 
     * @example {
     *   nodes: unknown[];
     *   edges: unknown[];
     *   viewport?: { x: number; y: number; zoom: number };
     * }
     */
    canvasData: jsonb("canvas_data").$type<WorkflowBuilderReactFlowJson>(),

    /**
     * Voice agent settings associated with this workflow
     */
    settings: jsonb("settings").$type<Record<string, unknown>>(),

    /**
     * Soft delete flag
     */
    isDeleted: boolean("is_deleted").default(false).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("workflow_user_id_idx").on(table.userId),
    index("workflow_is_deleted_idx").on(table.isDeleted),
  ]
);

// =============================================================================
// Workflow Release Table (Deployments)
// =============================================================================

/**
 * Release history for workflows. Each deployment creates a new release
 * with the extracted AgentFlow configuration.
 */
export const workflowRelease = pgTable(
  "workflow_release",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    workflowId: text("workflow_id")
      .notNull()
      .references(() => workflow.id, { onDelete: "cascade" }),

    /**
     * Auto-incrementing release number per workflow (e.g., Release #1, #2, #3)
     */
    releaseNumber: integer("release_number").notNull(),

    /**
     * User-provided release message/notes
     */
    message: text("message").notNull(),

    /**
     * The extracted AgentFlow configuration at the time of deployment.
     * This is the WorkflowConfig from extractWorkflowConfig().
     */
    agentFlow: jsonb("agent_flow").$type<{
      id: string;
      tenantId: string;
      name: string;
      initialState: string;
      states: Record<string, unknown>;
      global?: Record<string, unknown>;
    }>(),

    /**
     * Canvas data snapshot at release time (for rollback)
     */
    canvasSnapshot: jsonb("canvas_snapshot").$type<{
      nodes: unknown[];
      edges: unknown[];
      viewport?: { x: number; y: number; zoom: number };
    }>(),

    deployedAt: timestamp("deployed_at").defaultNow().notNull(),
    deployedBy: text("deployed_by")
      .notNull()
      .references(() => user.id, { onDelete: "set null" }),
  },
  (table) => [
    index("workflow_release_workflow_id_idx").on(table.workflowId),
    index("workflow_release_deployed_at_idx").on(table.deployedAt),
  ]
);

// =============================================================================
// Relations
// =============================================================================

export const workflowRelations = relations(workflow, ({ one, many }) => ({
  user: one(user, {
    fields: [workflow.userId],
    references: [user.id],
  }),
  releases: many(workflowRelease),
}));

export const workflowReleaseRelations = relations(
  workflowRelease,
  ({ one }) => ({
    workflow: one(workflow, {
      fields: [workflowRelease.workflowId],
      references: [workflow.id],
    }),
    deployedByUser: one(user, {
      fields: [workflowRelease.deployedBy],
      references: [user.id],
    }),
  })
);
