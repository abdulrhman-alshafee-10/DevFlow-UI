import { apiClient } from './client';

// ── Types ──────────────────────────────────────────────────────────────────

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  authorDisplayName: string;
  authorAvatarUrl: string | null;
  body: string;
  /** ISO-8601 — set only when the comment has been edited. */
  editedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentPayload {
  body: string;
}

export interface UpdateCommentPayload {
  body: string;
}

// ── API functions ──────────────────────────────────────────────────────────

/** Fetch all comments for a task (newest last). */
export async function listComments(taskId: string): Promise<Comment[]> {
  const res = await apiClient.get<Comment[]>(
    `/api/v1/tasks/${taskId}/comments`,
  );
  return res.data;
}

/** Post a new comment on a task. */
export async function createComment(
  taskId: string,
  payload: CreateCommentPayload,
): Promise<Comment> {
  const res = await apiClient.post<Comment>(
    `/api/v1/tasks/${taskId}/comments`,
    payload,
  );
  return res.data;
}

/** Edit the body of an existing comment. */
export async function updateComment(
  commentId: string,
  payload: UpdateCommentPayload,
): Promise<Comment> {
  const res = await apiClient.patch<Comment>(
    `/api/v1/comments/${commentId}`,
    payload,
  );
  return res.data;
}

/** Permanently delete a comment. */
export async function deleteComment(commentId: string): Promise<void> {
  await apiClient.delete(`/api/v1/comments/${commentId}`);
}
