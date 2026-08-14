'use client';

import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as attachmentsApi from '@/lib/api/attachments';
import { toast } from '@/components/ui/toast';
import type { Attachment, UploadState } from '@/types/attachment';
import type { ApiErrorResponse } from '@/types';

// ── Max file size: 10 MB ───────────────────────────────────────────────────
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

// ── Accepted MIME types ────────────────────────────────────────────────────
export const ACCEPTED_MIME: Record<string, string[]> = {
  'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
  'application/pdf': ['.pdf'],
  'text/plain': ['.txt'],
  'application/zip': ['.zip'],
};

export const attachmentKeys = {
  list: (taskId: string) => ['attachments', taskId] as const,
};

// ── Hook ───────────────────────────────────────────────────────────────────

export function useAttachments(taskId: string) {
  const queryClient = useQueryClient();
  const queryKey = attachmentKeys.list(taskId);

  // Persisted attachments from the server
  const query = useQuery({
    queryKey,
    queryFn: () => attachmentsApi.listAttachments(taskId),
    enabled: Boolean(taskId),
    staleTime: 30_000,
  });

  // In-flight upload slots shown in the UI while files are uploading
  const [uploads, setUploads] = useState<UploadState[]>([]);

  // ── Upload ─────────────────────────────────────────────────────────────
  const upload = useCallback(
    async (files: File[]) => {
      for (const file of files) {
        // Client-side validation
        if (file.size > MAX_SIZE_BYTES) {
          toast.error(`"${file.name}" exceeds the 10 MB limit.`);
          continue;
        }

        const slotId = crypto.randomUUID();
        const slot: UploadState = {
          id: slotId,
          file,
          progress: 0,
          status: 'uploading',
        };

        setUploads((prev) => [...prev, slot]);

        try {
          await attachmentsApi.uploadAttachment(taskId, file, (pct) => {
            setUploads((prev) =>
              prev.map((u) => (u.id === slotId ? { ...u, progress: pct } : u)),
            );
          });

          // Mark done then remove the slot after a short delay
          setUploads((prev) =>
            prev.map((u) =>
              u.id === slotId ? { ...u, progress: 100, status: 'done' } : u,
            ),
          );
          setTimeout(() => {
            setUploads((prev) => prev.filter((u) => u.id !== slotId));
          }, 1_500);

          // Refresh the persisted list
          queryClient.invalidateQueries({ queryKey });
        } catch {
          setUploads((prev) =>
            prev.map((u) => (u.id === slotId ? { ...u, status: 'error' } : u)),
          );
          toast.error(`Failed to upload "${file.name}". Please try again.`);
        }
      }
    },
    [taskId, queryClient, queryKey],
  );

  // ── Delete ─────────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (attachmentId: string) =>
      attachmentsApi.deleteAttachment(attachmentId),

    onMutate: async (attachmentId) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Attachment[]>(queryKey);
      queryClient.setQueryData<Attachment[]>(queryKey, (old = []) =>
        old.filter((a) => a.id !== attachmentId),
      );
      return { previous };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.previous !== undefined) {
        queryClient.setQueryData(queryKey, ctx.previous);
      }
      toast.error('Could not delete attachment.');
    },
  });

  return {
    attachments: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error as ApiErrorResponse | null,
    // In-flight uploads
    uploads,
    upload,
    // Delete
    deleteAttachment: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deletingId: deleteMutation.variables as string | undefined,
  };
}
