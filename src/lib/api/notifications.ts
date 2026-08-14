import { apiClient } from './client';
import type { Notification, NotificationsPage } from '@/types/notification';

// ── Request params ─────────────────────────────────────────────────────────

export interface ListNotificationsParams {
  page?: number;
  pageSize?: number;
  /** When true, returns only unread notifications. */
  unreadOnly?: boolean;
}

// ── API functions ──────────────────────────────────────────────────────────

/**
 * List the current user's notifications, newest first.
 * Returns a paginated envelope that also carries `unreadCount`.
 */
export async function listNotifications(
  params: ListNotificationsParams = {},
): Promise<NotificationsPage> {
  const res = await apiClient.get<NotificationsPage>('/api/v1/notifications', {
    params,
  });
  return res.data;
}

/** Mark a single notification as read. */
export async function markNotificationRead(id: string): Promise<Notification> {
  const res = await apiClient.patch<Notification>(
    `/api/v1/notifications/${id}/read`,
  );
  return res.data;
}

/** Mark every notification for the current user as read. */
export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.post('/api/v1/notifications/read-all');
}
