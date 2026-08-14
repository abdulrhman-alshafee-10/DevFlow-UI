/**
 * All WebSocket event shapes sent by the DevFlow backend.
 *
 * Discriminated by `type` so switch/exhaustive-check patterns work cleanly.
 */

// ── Payload shapes ─────────────────────────────────────────────────────────

export interface TaskUpdatedPayload {
  taskId: string;
  projectId: string;
}

export interface TaskCreatedPayload {
  taskId: string;
  projectId: string;
}

export interface TaskDeletedPayload {
  taskId: string;
  projectId: string;
}

export interface CommentCreatedPayload {
  commentId: string;
  taskId: string;
}

export interface CommentUpdatedPayload {
  commentId: string;
  taskId: string;
}

export interface CommentDeletedPayload {
  commentId: string;
  taskId: string;
}

export interface MemberJoinedPayload {
  userId: string;
  orgId: string;
}

export interface MemberLeftPayload {
  userId: string;
  orgId: string;
}

export interface NotificationPayload {
  /** The notification id so the client can append/invalidate precisely. */
  notificationId: string;
  /** Short human-readable message to show in a Toast. */
  message: string;
  /** Optional deep-link target. */
  resourceUrl: string | null;
}

// ── Discriminated union ────────────────────────────────────────────────────

export type WsEvent =
  | { type: 'task_updated'; payload: TaskUpdatedPayload }
  | { type: 'task_created'; payload: TaskCreatedPayload }
  | { type: 'task_deleted'; payload: TaskDeletedPayload }
  | { type: 'comment_created'; payload: CommentCreatedPayload }
  | { type: 'comment_updated'; payload: CommentUpdatedPayload }
  | { type: 'comment_deleted'; payload: CommentDeletedPayload }
  | { type: 'member_joined'; payload: MemberJoinedPayload }
  | { type: 'member_left'; payload: MemberLeftPayload }
  | { type: 'notification'; payload: NotificationPayload }
  | { type: 'ping' };

/** Parse a raw WebSocket message data string into a `WsEvent`. */
export function parseWsEvent(raw: string): WsEvent | null {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed?.type === 'string') return parsed as WsEvent;
    return null;
  } catch {
    return null;
  }
}
