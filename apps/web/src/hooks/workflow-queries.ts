"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { skipToken } from "@tanstack/react-query";
import { orpc, client } from "@/utils/orpc";
import type { WorkflowConfig } from "@/utils/state-machine-types";

// =============================================================================
// Types (inferred from API)
// =============================================================================

export type Workflow = Awaited<ReturnType<typeof client.workflow.getById>>;
export type WorkflowRelease = Awaited<ReturnType<typeof client.workflow.listReleases>>[number];
export type WorkflowListResponse = Awaited<ReturnType<typeof client.workflow.list>>;

// =============================================================================
// Query Hooks (using orpc.queryOptions pattern)
// =============================================================================

/**
 * List user's workflows
 */
export function useWorkflows(options?: { limit?: number; offset?: number }) {
  return useQuery(
    orpc.workflow.list.queryOptions({
      input: {
        limit: options?.limit ?? 20,
        offset: options?.offset ?? 0,
      },
    })
  );
}

/**
 * Get a single workflow by ID
 */
export function useWorkflow(id: string | undefined) {
  return useQuery(
    orpc.workflow.getById.queryOptions({
      input: id ? { id } : skipToken,
    })
  );
}

/**
 * Get releases for a workflow
 */
export function useWorkflowReleases(workflowId: string | undefined) {
  return useQuery(
    orpc.workflow.listReleases.queryOptions({
      input: workflowId ? { id: workflowId } : skipToken,
    })
  );
}

// =============================================================================
// Mutation Hooks (using orpc.mutationOptions pattern)
// =============================================================================

/**
 * Create a new workflow
 */
export function useCreateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation(
    orpc.workflow.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.workflow.list.key({}) });
      },
    })
  );
}

/**
 * Update a workflow
 */
export function useUpdateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation(
    orpc.workflow.update.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: orpc.workflow.getById.key({ input: { id: data.id } }),
        });
        queryClient.invalidateQueries({ queryKey: orpc.workflow.list.key({}) });
      },
    })
  );
}

/**
 * Delete a workflow (soft delete)
 */
export function useDeleteWorkflow() {
  const queryClient = useQueryClient();

  return useMutation(
    orpc.workflow.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.workflow.list.key({}) });
      },
    })
  );
}

/**
 * Deploy a workflow (create a new release)
 */
export function useDeployWorkflow() {
  const queryClient = useQueryClient();

  return useMutation(
    orpc.workflow.deploy.mutationOptions({
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: orpc.workflow.listReleases.key({ input: { id: variables.workflowId } }),
        });
      },
    })
  );
}

/**
 * Rollback to a previous release
 */
export function useRollbackWorkflow() {
  const queryClient = useQueryClient();

  return useMutation(
    orpc.workflow.rollback.mutationOptions({
      onSuccess: (data, variables) => {
        // Invalidate the workflow data using orpc's key generator
        queryClient.invalidateQueries({
          queryKey: orpc.workflow.getById.key({ input: { id: data.id } }),
        });
        // Invalidate the releases list so DeployDialog updates
        queryClient.invalidateQueries({
          queryKey: orpc.workflow.listReleases.key({ input: { id: variables.workflowId } }),
        });
      },
    })
  );
}
