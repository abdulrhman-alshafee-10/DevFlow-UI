'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as commentsApi from '@/lib/api/comments';
import type {
  Comment,
  CreateCommentPayload,
  UpdateCommentPayload,
} from '@/lib/api/comments';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from '@/components/ui/toast';
import type { ApiErrorResponse } from '@/types';

const commentKeys = {
  list: (taskId: string) => ['comments', taskId] as const,
};

export function useComments(taskId: string) {
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const queryKey = commentKeys.list(taskId);

  const query = useQuery({
    queryKey,
    queryFn: () => commentsApi.listComments(taskId),
    enabled: Boolean(taskId),
    staleTime: 15_000,
  });

  // ── Create (optimistic) ────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (payload: CreateCommentPayload) =>
      commentsApi.createComment(taskId, payload),

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Comment[]>(queryKey);

      const optimistic: Comment = {
        id: `optimistic-${Date.now()}`,
        taskId,
        authorId: currentUserId ?? 'unknown',
        authorDisplayName: 'You',
        authorAvatarUrl: null,
        body: payload.body,
        editedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Comment[]>(queryKey, (old = []) => [
        ...old,
        optimistic,
      ]);

      return { previous };
    },

    onError: (_err, _payload, ctx) => {
      if (ctx?.previous !== undefined)
        queryClient.setQueryData(queryKey, ctx.previous);
      toast.error('Could not post comment. Please try again.');
    },

    onSuccess: (newComment) => {
      // Replace the optimistic entry with the real one
      queryClient.setQueryData<Comment[]>(queryKey, (old = []) =>
        old.map((c) => (c.id.startsWith('optimistic-') ? newComment : c)),
      );
    },
  });

  // ── Update ─────────────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({
      commentId,
      payload,
    }: {
      commentId: string;
      payload: UpdateCommentPayload;
    }) => commentsApi.updateComment(commentId, payload),

    onSuccess: (updated) => {
      queryClient.setQueryData<Comment[]>(queryKey, (old = []) =>
        old.map((c) => (c.id === updated.id ? updated : c)),
      );
    },

    onError: (err: ApiErrorResponse) => {
      toast.error(err.message ?? 'Could not update comment.');
    },
  });

  // ── Delete (optimistic) ────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (commentId: string) => commentsApi.deleteComment(commentId),

    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Comment[]>(queryKey);

      queryClient.setQueryData<Comment[]>(queryKey, (old = []) =>
        old.filter((c) => c.id !== commentId),
      );

      return { previous };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.previous !== undefined)
        queryClient.setQueryData(queryKey, ctx.previous);
      toast.error('Could not delete comment.');
    },
  });

  return {
    comments: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error as ApiErrorResponse | null,
    currentUserId,
    // Create
    createComment: createMutation.mutate,
    createCommentAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    // Update
    updateComment: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updatingId: updateMutation.variables?.commentId,
    // Delete
    deleteComment: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deletingId: deleteMutation.variables as string | undefined,
  };
}
