import { apiClient } from './client';
import type { Attachment } from '@/types/attachment';

// ── API functions ──────────────────────────────────────────────────────────

/** Fetch all attachments for a task. */
export async function listAttachments(taskId: string): Promise<Attachment[]> {
  const res = await apiClient.get<Attachment[]>(
    `/api/v1/tasks/${taskId}/attachments`,
  );
  return res.data;
}

/**
 * Upload a file to a task.
 *
 * @param taskId  - The task to attach the file to.
 * @param file    - The `File` object selected / dropped by the user.
 * @param onProgress - Called with 0–100 as the upload progresses.
 */
export async function uploadAttachment(
  taskId: string,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<Attachment> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await apiClient.post<Attachment>(
    `/api/v1/tasks/${taskId}/attachments`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (event.total && onProgress) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      },
    },
  );
  return res.data;
}

/** Delete an attachment by id. */
export async function deleteAttachment(attachmentId: string): Promise<void> {
  await apiClient.delete(`/api/v1/attachments/${attachmentId}`);
}
