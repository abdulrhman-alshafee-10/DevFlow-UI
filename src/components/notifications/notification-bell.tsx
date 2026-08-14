'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationPanel } from './notification-panel';
import { useNotificationUnreadCount } from '@/hooks/use-notifications';

/**
 * Topbar bell icon with a live unread-count badge.
 *
 * Opens a `NotificationPanel` in a dropdown on click.
 * The unread count is polled every 60 s and also refreshed via WebSocket
 * invalidations from `useRealtimeSync`.
 */
export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data: unreadCount = 0 } = useNotificationUnreadCount();

  const hasUnread = unreadCount > 0;
  const label = hasUnread
    ? `Notifications — ${unreadCount} unread`
    : 'Notifications';

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={label}
          aria-haspopup="true"
          aria-expanded={open}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'relative',
          )}
        >
          <Bell className="size-4" aria-hidden="true" />

          {/* Unread badge */}
          {hasUnread && (
            <span
              aria-hidden="true"
              className={cn(
                'absolute right-1 top-1 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground',
                'text-[10px] font-semibold leading-none',
                unreadCount > 9
                  ? 'h-4 min-w-4 px-1' // wider for double-digit
                  : 'h-4 w-4',
              )}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="p-0"
        // Prevent the dropdown from closing when clicking inside the panel
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <NotificationPanel />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
