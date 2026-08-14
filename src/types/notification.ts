import type { Timestamps } from './index';

/**
 * The category of event that triggered the notification.
 * Used to drive icon selection and grouping in the UI.
 */
export type NotificationType =
  | 'task_assigned'
  | 'task_updated'
  | 'task_commented'
  | 'task_mentioned'
  | 'member_joined'
  | 'member_left'
  | 'project_updated';

/** A single notification returned by the DevFlow API. */
export interface Notification extends Timestamps {
  id: string;
  userId: string;
  type: NotificationType;
  /** Short human-readable sentence, e.g. "Alice assigned you to Fix login bug". */
  message: string;
  /** Deep-link target — may be null for org-level events. */
  resourceUrl: string | null;
  /** Whether the user has already seen/read this notification. */
  read: boolean;
}

/** Paginated envelope for the notifications list. */
export interface NotificationsPage {
  items: Notification[];
  total: number;
  page: number;
  pageSize: number;
  unreadCount: number;
}
