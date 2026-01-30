import { client } from "@/utils/orpc";
import type { AppRouterClient } from "@kyso/api/routers/index";
import { auth } from "@kyso/auth";
import { headers } from "next/headers";
import { cache } from "react";

// =============================================================================
// Server-Side oRPC Client
// Creates an oRPC client that works on the server with proper headers
// =============================================================================

const getServerClient = cache(async (): Promise<AppRouterClient> => {
  return client;
});

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
 * Get a workflow by ID using oRPC (cached per request)
 * Returns null if not found or not owned
 */
export const getWorkflow = cache(async (workflowId: string) => {
  const session = await getSession();

  if (!session?.user?.id) {
    return null;
  }

  try {
    const client = await getServerClient();
    const workflow = await client.workflow.getById({ id: workflowId });
    return workflow;
  } catch {
    // Returns null for NOT_FOUND errors

    console.error("Failed to fetch workflow", session, workflowId);
    return null;
  }
});

/**
 * Get all workflows for current user using oRPC (cached per request)
 */
export const getWorkflows = cache(async () => {
  const session = await getSession();

  if (!session?.user?.id) {
    return { workflows: [], total: 0 };
  }

  try {
    const client = await getServerClient();
    const result = await client.workflow.list({ limit: 50, offset: 0 });
    return result;
  } catch {
    return { workflows: [], total: 0 };
  }
});

/**
 * Get releases for a workflow using oRPC (cached per request)
 */
export const getWorkflowReleases = cache(async (workflowId: string) => {
  const session = await getSession();

  if (!session?.user?.id) {
    return [];
  }

  try {
    const client = await getServerClient();
    const releases = await client.workflow.listReleases({ id: workflowId });
    return releases;
  } catch {
    return [];
  }
});
