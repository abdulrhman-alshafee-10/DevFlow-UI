'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import * as projectsApi from '@/lib/api/projects';
import type {
  CreateProjectPayload,
  UpdateProjectPayload,
  ListProjectsParams,
} from '@/lib/api/projects';
import { useOrgStore } from '@/stores/org-store';
import { toast } from '@/components/ui/toast';
import type { ApiErrorResponse, Project } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// Project list
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Lists all projects for the active organization.
 * Includes an optimistic create and optimistic delete.
 */
export function useProjects(params: ListProjectsParams = {}) {
  const queryClient = useQueryClient();
  const orgId = useOrgStore((s) => s.activeOrg?.id);

  const queryKey = ['projects', orgId, params] as const;

  const query = useQuery({
    queryKey,
    queryFn: () => projectsApi.listProjects(orgId!, params),
    enabled: Boolean(orgId),
    staleTime: 30_000,
  });

  // ── Create (optimistic) ────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (payload: CreateProjectPayload) =>
      projectsApi.createProject(orgId!, payload),

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);

      // Inject a temporary placeholder so the UI responds instantly
      queryClient.setQueryData(queryKey, (old: typeof query.data) => {
        if (!old) return old;
        const optimistic: Project = {
          id: `optimistic-${Date.now()}`,
          organizationId: orgId!,
          name: payload.name,
          description: payload.description ?? null,
          status: 'active',
          dueDate: payload.dueDate ?? null,
          memberCount: 1,
          taskCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return {
          ...old,
          items: [optimistic, ...old.items],
          total: old.total + 1,
        };
      });

      return { previous };
    },

    onError: (_err, _payload, ctx) => {
      // Roll back on failure
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
      toast.error('Could not create project. Please try again.');
    },

    onSuccess: (newProject) => {
      // Replace the optimistic entry with the real one
      queryClient.setQueryData(queryKey, (old: typeof query.data) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((p) =>
            p.id.startsWith('optimistic-') ? newProject : p,
          ),
        };
      });
      toast.success(`Project "${newProject.name}" created.`);
    },
  });

  // ── Delete (optimistic) ────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (projectId: string) => projectsApi.deleteProject(projectId),

    onMutate: async (projectId) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: typeof query.data) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.filter((p) => p.id !== projectId),
          total: old.total - 1,
        };
      });

      return { previous };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
      toast.error('Could not delete project. Please try again.');
    },

    onSuccess: () => {
      toast.success('Project deleted.');
    },
  });

  return {
    projects: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    error: query.error as ApiErrorResponse | null,
    // Create
    createProject: createMutation.mutate,
    createProjectAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error as ApiErrorResponse | null,
    // Delete
    deleteProject: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Single project
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches and manages a single project — used on the settings page
 * and the project detail layout.
 */
export function useProject(projectId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const queryKey = ['projects', projectId] as const;

  const query = useQuery({
    queryKey,
    queryFn: () => projectsApi.getProject(projectId),
    enabled: Boolean(projectId),
    staleTime: 30_000,
  });

  // ── Update ─────────────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: (payload: UpdateProjectPayload) =>
      projectsApi.updateProject(projectId, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKey, updated);
      // Also invalidate the list so the card reflects the new name/status
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project updated.');
    },
    onError: (err: ApiErrorResponse) => {
      toast.error(err.message ?? 'Could not update project.');
    },
  });

  // ── Delete ─────────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: () => projectsApi.deleteProject(projectId),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted.');
      router.push('/projects');
    },
    onError: (err: ApiErrorResponse) => {
      toast.error(err.message ?? 'Could not delete project.');
    },
  });

  return {
    project: query.data,
    isLoading: query.isLoading,
    error: query.error as ApiErrorResponse | null,
    // Update
    updateProject: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error as ApiErrorResponse | null,
    // Delete
    deleteProject: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
