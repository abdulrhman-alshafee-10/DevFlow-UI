'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as tasksApi from '@/lib/api/tasks';
import type {
  CreateTaskPayload,
  UpdateTaskPayload,
  ListTasksParams,
} from '@/lib/api/tasks';
import { toast } from '@/components/ui/toast';
import type { ApiErrorResponse, Task, Status } from '@/types';

// ── Query key factory ──────────────────────────────────────────────────────

export const taskKeys = {
  all: (projectId: string) => ['tasks', projectId] as const,
  filtered: (projectId: string, params: ListTasksParams) =>
    ['tasks', projectId, params] as const,
};

// ─────────────────────────────────────────────────────────────────────────────
// Task list
// ─────────────────────────────────────────────────────────────────────────────

export function useTasks(projectId: string, filters: ListTasksParams = {}) {
  const queryClient = useQueryClient();
  const queryKey = taskKeys.filtered(projectId, filters);

  const query = useQuery({
    queryKey,
    queryFn: () => tasksApi.listTasks(projectId, filters),
    enabled: Boolean(projectId),
    staleTime: 15_000,
  });

  // ── Create (optimistic) ────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (payload: CreateTaskPayload) =>
      tasksApi.createTask(projectId, payload),

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Task[]>(queryKey);

      const optimistic: Task = {
        id: `optimistic-${Date.now()}`,
        projectId,
        title: payload.title,
        description: payload.description ?? null,
        status: payload.status ?? 'todo',
        priority: payload.priority ?? 'medium',
        assigneeId: payload.assigneeId ?? null,
        dueDate: payload.dueDate ?? null,
        position: (previous?.length ?? 0) + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Task[]>(queryKey, (old = []) => [
        ...old,
        optimistic,
      ]);

      return { previous };
    },

    onError: (_err, _payload, ctx) => {
      if (ctx?.previous !== undefined)
        queryClient.setQueryData(queryKey, ctx.previous);
      toast.error('Could not create task. Please try again.');
    },

    onSuccess: (newTask) => {
      queryClient.setQueryData<Task[]>(queryKey, (old = []) =>
        old.map((t) => (t.id.startsWith('optimistic-') ? newTask : t)),
      );
      toast.success('Task created.');
    },
  });

  // ── Move/reorder (optimistic) ──────────────────────────────────────────
  const moveMutation = useMutation({
    mutationFn: ({
      taskId,
      payload,
    }: {
      taskId: string;
      payload: UpdateTaskPayload;
    }) => tasksApi.updateTask(taskId, payload),

    onMutate: async ({ taskId, payload }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Task[]>(queryKey);

      queryClient.setQueryData<Task[]>(queryKey, (old = []) =>
        old.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status: (payload.status as Status) ?? t.status,
                position: payload.position ?? t.position,
              }
            : t,
        ),
      );

      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous !== undefined)
        queryClient.setQueryData(queryKey, ctx.previous);
      toast.error('Could not move task. Please try again.');
    },
  });

  return {
    tasks: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error as ApiErrorResponse | null,
    // Create
    createTask: createMutation.mutate,
    createTaskAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error as ApiErrorResponse | null,
    // Move / reorder
    moveTask: moveMutation.mutate,
    isMoving: moveMutation.isPending,
  };
}
