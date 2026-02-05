import { db } from "@kyso/db";
import { workflow, workflowRelease } from "@kyso/db";
import { ORPCError } from "@orpc/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure } from "../index";

// =============================================================================
// Input Schemas
// =============================================================================

const createWorkflowInput = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  canvasData: z
    .object({
      nodes: z.array(z.unknown()),
      edges: z.array(z.unknown()),
      viewport: z
        .object({
          x: z.number(),
          y: z.number(),
          zoom: z.number(),
        })
        .optional(),
    })
    .optional(),
});


const updateWorkflowInput = z.object({
  id: z.string(),
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  canvasData: z
    .object({
      nodes: z.array(z.unknown()),
      edges: z.array(z.unknown()),
      viewport: z
        .object({
          x: z.number(),
          y: z.number(),
          zoom: z.number(),
        })
        .optional(),
    })
    .optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
});

const deployWorkflowInput = z.object({
  workflowId: z.string(),
  message: z.string().min(1).max(500),
  agentFlow: z.object({
    id: z.string(),
    tenantId: z.string(),
    name: z.string(),
    initialState: z.string(),
    states: z.record(z.string(), z.unknown()),
    global: z.record(z.string(), z.unknown()).optional(),
  }),
});

const rollbackInput = z.object({
  workflowId: z.string(),
  releaseId: z.string(),
});

const listInput = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

const byIdInput = z.object({
  id: z.string(),
});

// =============================================================================
// Helper: Verify Workflow Ownership
// =============================================================================

async function verifyOwnership(workflowId: string, userId: string) {
  const found = await db.query.workflow.findFirst({
    where: and(
      eq(workflow.id, workflowId),
      eq(workflow.userId, userId),
      eq(workflow.isDeleted, false)
    ),
  });

  if (!found) {
    throw new ORPCError("NOT_FOUND", { message: "Workflow not found" });
  }

  return found;
}

// =============================================================================
// Workflow Router
// =============================================================================

export const workflowRouter = {
  /**
   * Create a new workflow
   */
  create: protectedProcedure
    .input(createWorkflowInput)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      console.info(`[workflow.create] User ${userId} creating workflow`);

      const [created] = await db
        .insert(workflow)
        .values({
          name: input.name ?? "Untitled Workflow",
          description: input.description,
          userId,
          canvasData: input.canvasData ?? { nodes: [], edges: [] },
          settings: {},
        })
        .returning();

      console.info(`[workflow.create] Created workflow ${created?.id}`);

      return created;
    }),

  /**
   * List user's workflows (paginated, excludes deleted)
   */
  list: protectedProcedure
    .input(listInput)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      console.info(`[workflow.list] User ${userId} listing workflows`);

      const workflows = await db.query.workflow.findMany({
        where: and(eq(workflow?.userId, userId), eq(workflow?.isDeleted, false)),
        limit: input.limit,
        offset: input.offset,
        orderBy: [desc(workflow?.updatedAt)],
      });

      // Get total count for pagination
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(workflow)
        .where(and(eq(workflow?.userId, userId), eq(workflow?.isDeleted, false)));

      return {
        workflows,
        total: Number(count),
        limit: input.limit,
        offset: input.offset,
      };
    }),

  /**
   * Get a single workflow by ID
   */
  getById: protectedProcedure
    .input(byIdInput)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      console.info(
        `[workflow.getById] User ${userId} getting workflow ${input.id}`
      );

      const found = await verifyOwnership(input.id, userId);
      return found;
    }),

  /**
   * Update a workflow (name, description, canvas data, settings)
   */
  update: protectedProcedure
    .input(updateWorkflowInput)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      console.info(
        `[workflow.update] User ${userId} updating workflow ${input.id}`
      );

      await verifyOwnership(input.id, userId);

      const updateData: Partial<typeof workflow.$inferInsert> = {};

      if (input.name !== undefined) {
        updateData.name = input.name;
      }
      if (input.description !== undefined) {
        updateData.description = input.description;
      }
      if (input.canvasData !== undefined) {
        updateData.canvasData = input.canvasData;
      }
      if (input.settings !== undefined) {
        updateData.settings = input.settings;
      }

      const [updated] = await db
        .update(workflow)
        .set(updateData)
        .where(eq(workflow.id, input.id))
        .returning();

      console.info(`[workflow.update] Updated workflow ${input.id}`);

      return updated;
    }),

  /**
   * Soft delete a workflow
   */
  delete: protectedProcedure
    .input(byIdInput)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      console.info(
        `[workflow.delete] User ${userId} deleting workflow ${input.id}`
      );

      await verifyOwnership(input.id, userId);

      await db
        .update(workflow)
        .set({ isDeleted: true })
        .where(eq(workflow.id, input.id));

      console.info(`[workflow.delete] Soft deleted workflow ${input.id}`);

      return { success: true };
    }),

  /**
   * Deploy a workflow (create a new release)
   */
  deploy: protectedProcedure
    .input(deployWorkflowInput)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      console.info(
        `[workflow.deploy] User ${userId} deploying workflow ${input.workflowId}`
      );

      const found = await verifyOwnership(input.workflowId, userId);

      // Get the next release number
      const [lastRelease] = await db
        .select({ releaseNumber: workflowRelease.releaseNumber })
        .from(workflowRelease)
        .where(eq(workflowRelease.workflowId, input.workflowId))
        .orderBy(desc(workflowRelease.releaseNumber))
        .limit(1);

      const nextReleaseNumber = (lastRelease?.releaseNumber ?? 0) + 1;

      // Create the release
      const [release] = await db
        .insert(workflowRelease)
        .values({
          workflowId: input.workflowId,
          releaseNumber: nextReleaseNumber,
          message: input.message,
          agentFlow: input.agentFlow,
          canvasSnapshot: found.canvasData,
          deployedBy: userId,
        })
        .returning();

      console.info(
        `[workflow.deploy] Created release #${nextReleaseNumber} for workflow ${input.workflowId}`
      );

      return release;
    }),

  /**
   * List releases for a workflow
   */
  listReleases: protectedProcedure
    .input(byIdInput)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      console.info(
        `[workflow.listReleases] User ${userId} listing releases for ${input.id}`
      );

      await verifyOwnership(input.id, userId);

      const releases = await db.query.workflowRelease.findMany({
        where: eq(workflowRelease.workflowId, input.id),
        orderBy: [desc(workflowRelease.releaseNumber)],
      });

      return releases;
    }),

  /**
   * Rollback to a previous release
   */
  rollback: protectedProcedure
    .input(rollbackInput)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      console.info(
        `[workflow.rollback] User ${userId} rolling back workflow ${input.workflowId} to release ${input.releaseId}`
      );

      await verifyOwnership(input.workflowId, userId);

      // Find the release
      const release = await db.query.workflowRelease.findFirst({
        where: and(
          eq(workflowRelease.id, input.releaseId),
          eq(workflowRelease.workflowId, input.workflowId)
        ),
      });

      if (!release) {
        throw new ORPCError("NOT_FOUND", { message: "Release not found" });
      }

      if (!release.canvasSnapshot) {
        throw new ORPCError("BAD_REQUEST", {
          message: "Release has no canvas snapshot",
        });
      }

      // Restore the canvas data from the release
      const [updated] = await db
        .update(workflow)
        .set({ canvasData: release.canvasSnapshot })
        .where(eq(workflow.id, input.workflowId))
        .returning();

      console.info(
        `[workflow.rollback] Rolled back workflow ${input.workflowId} to release #${release.releaseNumber}`
      );

      return updated;
    }),
};
