'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as tasksApi from '@/lib/api/tasks';
import type { UpdateTaskPayload } from '@/lib/api/tasks';
import { toast } from '@/components/ui/toast';
import type { ApiErrorResponse, Task } from '@/types';

/**
 * Fetches a single task and exposes an update mutation.
 * Used by both the intercepting-route modal and the standalone task page.
 */
export function useTaskDetail(taskId: string) {
  const queryClient = useQueryClient();
  const queryKey = ['task', taskId] as const;

  const query = useQuery({
    queryKey,
    queryFn: () => tasksApi.getTask(taskId),
    enabled: Boolean(taskId),
    staleTime: 30_000,
  });

  // ── History ────────────────────────────────────────────────────────────
  const historyQuery = useQuery({
    queryKey: ['task', taskId, 'history'],
    queryFn: () => tasksApi.getTaskHistory(taskId),
    enabled: Boolean(taskId),
    staleTime: 30_000,
  });

  // ── Inline update ──────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: (payload: UpdateTaskPayload) =>
      tasksApi.updateTask(taskId, payload),

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Task>(queryKey);

      // Optimistically update the detail cache
      queryClient.setQueryData<Task>(queryKey, (old) =>
        old ? { ...old, ...payload } : old,
      );

      return { previous };
    },

    onError: (_err, _payload, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
      toast.error('Could not save changes. Please try again.');
    },

    onSuccess: (updated: Task) => {
      queryClient.setQueryData(queryKey, updated);
      // Also refresh the task list cache so the board/list reflects the change
      queryClient.invalidateQueries({ queryKey: ['tasks', updated.projectId] });
      // Refresh history
      queryClient.invalidateQueries({ queryKey: ['task', taskId, 'history'] });
    },
  });

  return {
    task: query.data,
    isLoading: query.isLoading,
    error: query.error as ApiErrorResponse | null,
    history: historyQuery.data ?? [],
    isLoadingHistory: historyQuery.isLoading,
    updateTask: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}
