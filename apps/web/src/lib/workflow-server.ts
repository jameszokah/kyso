import { auth } from "@kyso/auth";
import { db, workflow, workflowRelease } from "@kyso/db";
import { and, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { cache } from "react";
import { authClient } from "./auth-client";

// =============================================================================
// Cached Server-Side Data Fetching
// Uses React.cache() for per-request deduplication
// =============================================================================

/**
 * Get current user session (cached per request)
 */
export const getSession = cache(async () => {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  return session;
});

/**
 * Get a workflow by ID (cached per request)
 * Validates ownership - returns null if not found or not owned
 */
export const getWorkflow = cache(async (workflowId: string) => {
  const session = await getSession();

  if (!session?.user?.id) {
    return null;
  }

  const found = await db.query.workflow.findFirst({
    where: and(
      eq(workflow.id, workflowId),
      eq(workflow.userId, session.user.id),
      eq(workflow.isDeleted, false)
    ),
  });

  return found ?? null;
});


// =============================================================================
// Get Customer State Data
// =============================================================================

/**
 * Get customer state (cached per request)
 */
export const getCustomerState = cache(async () => {
  const session = await getSession();

  if (!session?.user?.id) {
    return null;
  }

  const customerState = await authClient.customer.state({
    fetchOptions: {
      headers: await headers(),
    },
  });

  return customerState;
});



/**
 * Get all workflows for current user (cached per request)
 */
export const getWorkflows = cache(async () => {
  const session = await getSession();

  if (!session?.user?.id) {
    return [];
  }

  const workflows = await db.query.workflow.findMany({
    where: and(
      eq(workflow.userId, session.user.id),
      eq(workflow.isDeleted, false)
    ),
    orderBy: [desc(workflow.updatedAt)],
  });

  return workflows;
});

/**
 * Get releases for a workflow (cached per request)
 */
export const getWorkflowReleases = cache(async (workflowId: string) => {
  const session = await getSession();

  if (!session?.user?.id) {
    return [];
  }

  // Verify ownership first
  const wf = await getWorkflow(workflowId);
  if (!wf) {
    return [];
  }

  const releases = await db.query.workflowRelease.findMany({
    where: eq(workflowRelease.workflowId, workflowId),
    orderBy: [desc(workflowRelease.releaseNumber)],
  });

  return releases;
});
