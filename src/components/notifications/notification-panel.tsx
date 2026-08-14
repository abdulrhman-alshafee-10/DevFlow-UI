'use client';

import { useRef, useCallback } from 'react';
import { CheckCheck, BellOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { NotificationItem } from './notification-item';
import { useNotifications } from '@/hooks/use-notifications';

/**
 * Scrollable notification list panel.
 * Rendered inside `NotificationBell`'s dropdown.
 */
export function NotificationPanel() {
  const {
    notifications,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    markRead,
    isMarkingRead,
    markAll,
    isMarkingAll,
  } = useNotifications();

  // ── Infinite scroll via IntersectionObserver ──────────────────────────
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const attachSentinel = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!node || !hasNextPage) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && !isFetchingNextPage) {
            void fetchNextPage();
          }
        },
        { threshold: 0.1 },
      );
      observerRef.current.observe(node);
      sentinelRef.current = node;
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  // ── Render ─────────────────────────────────────────────────────────────
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex w-80 flex-col" aria-label="Notifications">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
        <h2 className="text-sm font-semibold">Notifications</h2>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAll()}
            disabled={isMarkingAll}
            className="h-7 gap-1.5 text-xs"
          >
            {isMarkingAll ? (
              <Spinner className="size-3.5" label="Marking all as read" />
            ) : (
              <CheckCheck className="size-3.5" aria-hidden="true" />
            )}
            Mark all read
          </Button>
        )}
      </div>

      {/* Body */}
      <div
        className="max-h-[420px] overflow-y-auto py-1"
        role="list"
        aria-live="polite"
        aria-label="Notification list"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Spinner className="size-6" label="Loading notifications" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
            <BellOff className="size-7" aria-hidden="true" />
            <p className="text-sm">You're all caught up!</p>
          </div>
        ) : (
          <ul className="px-1">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={markRead}
                isMarkingRead={isMarkingRead}
              />
            ))}

            {/* Infinite scroll sentinel */}
            <div ref={attachSentinel} aria-hidden="true" />

            {isFetchingNextPage && (
              <div className="flex justify-center py-3">
                <Spinner
                  className="size-4"
                  label="Loading more notifications"
                />
              </div>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
