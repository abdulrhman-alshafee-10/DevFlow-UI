'use client';

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import * as notificationsApi from '@/lib/api/notifications';
import type { ListNotificationsParams } from '@/lib/api/notifications';
import type { Notification, NotificationsPage } from '@/types/notification';
import { toast } from '@/components/ui/toast';
import type { ApiErrorResponse } from '@/types';

// ── Query key factory ──────────────────────────────────────────────────────

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (params: ListNotificationsParams) =>
    ['notifications', 'list', params] as const,
  unreadCount: ['notifications', 'unread-count'] as const,
  infinite: ['notifications', 'infinite'] as const,
};

// ─────────────────────────────────────────────────────────────────────────────
// Unread count — polled so the bell badge stays reasonably fresh even when
// no WebSocket notification arrives (e.g. after a page refresh).
// ─────────────────────────────────────────────────────────────────────────────

export function useNotificationUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount,
    queryFn: async () => {
      const data = await notificationsApi.listNotifications({
        pageSize: 1,
        unreadOnly: true,
      });
      return data.unreadCount;
    },
    staleTime: 30_000,
    refetchInterval: 60_000, // passive poll as fallback
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Infinite-scroll notification list
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

export function useNotificationsInfinite() {
  return useInfiniteQuery({
    queryKey: notificationKeys.infinite,
    queryFn: ({ pageParam = 1 }) =>
      notificationsApi.listNotifications({
        page: pageParam,
        pageSize: PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: NotificationsPage) => {
      const fetched =
        (lastPage.page - 1) * lastPage.pageSize + lastPage.items.length;
      return fetched < lastPage.total ? lastPage.page + 1 : undefined;
    },
    staleTime: 15_000,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────────────

/** Mark a single notification as read with an optimistic update. */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markNotificationRead(id),

    // Optimistically flip the `read` flag in every infinite-query page
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.infinite });

      const previous = queryClient.getQueryData(notificationKeys.infinite);

      queryClient.setQueriesData<{
        pages: NotificationsPage[];
        pageParams: unknown[];
      }>({ queryKey: notificationKeys.infinite }, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((n) =>
              n.id === id ? { ...n, read: true } : n,
            ),
          })),
        };
      });

      // Decrement unread count
      queryClient.setQueryData<number>(notificationKeys.unreadCount, (c = 0) =>
        Math.max(0, c - 1),
      );

      return { previous };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.previous !== undefined) {
        queryClient.setQueryData(notificationKeys.infinite, ctx.previous);
      }
      toast.error('Could not mark notification as read.');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount });
    },
  });
}

/** Mark all notifications as read. */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllNotificationsRead(),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.infinite });

      const previous = queryClient.getQueryData(notificationKeys.infinite);

      // Flip every item to read
      queryClient.setQueriesData<{
        pages: NotificationsPage[];
        pageParams: unknown[];
      }>({ queryKey: notificationKeys.infinite }, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((n) => ({ ...n, read: true })),
          })),
        };
      });

      queryClient.setQueryData<number>(notificationKeys.unreadCount, 0);

      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous !== undefined) {
        queryClient.setQueryData(notificationKeys.infinite, ctx.previous);
      }
      toast.error('Could not mark all notifications as read.');
    },

    onSuccess: () => {
      toast.success('All notifications marked as read.');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Composite hook — used by NotificationPanel
// ─────────────────────────────────────────────────────────────────────────────

export function useNotifications() {
  const infiniteQuery = useNotificationsInfinite();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  // Flatten pages into a single sorted list
  const notifications: Notification[] =
    infiniteQuery.data?.pages.flatMap((p) => p.items) ?? [];

  return {
    notifications,
    isLoading: infiniteQuery.isLoading,
    isFetchingNextPage: infiniteQuery.isFetchingNextPage,
    hasNextPage: infiniteQuery.hasNextPage,
    fetchNextPage: infiniteQuery.fetchNextPage,
    error: infiniteQuery.error as ApiErrorResponse | null,
    // Mark read
    markRead: markRead.mutate,
    isMarkingRead: markRead.isPending,
    // Mark all
    markAll: markAll.mutate,
    isMarkingAll: markAll.isPending,
  };
}
