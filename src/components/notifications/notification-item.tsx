'use client';

import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  MessageSquare,
  UserCheck,
  UserMinus,
  FolderOpen,
  ClipboardList,
  AtSign,
} from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { Spinner } from '@/components/ui/spinner';
import type { Notification, NotificationType } from '@/types/notification';

// ── Icon map ───────────────────────────────────────────────────────────────

const iconMap: Record<NotificationType, React.ElementType> = {
  task_assigned: ClipboardList,
  task_updated: ClipboardList,
  task_commented: MessageSquare,
  task_mentioned: AtSign,
  member_joined: UserCheck,
  member_left: UserMinus,
  project_updated: FolderOpen,
};

// ── Relative time helper ───────────────────────────────────────────────────

function relativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(isoDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

// ── Component ──────────────────────────────────────────────────────────────

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  isMarkingRead: boolean;
}

export function NotificationItem({
  notification,
  onMarkRead,
  isMarkingRead,
}: NotificationItemProps) {
  const Icon = iconMap[notification.type] ?? Bell;
  const timeAgo = relativeTime(notification.createdAt);

  const content = (
    <div
      className={cn(
        'flex items-start gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
        notification.read
          ? 'text-muted-foreground'
          : 'bg-accent/50 text-foreground',
      )}
    >
      {/* Icon */}
      <span
        className={cn(
          'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full',
          notification.read
            ? 'bg-muted text-muted-foreground'
            : 'bg-primary/10 text-primary',
        )}
        aria-hidden="true"
      >
        <Icon className="size-3.5" />
      </span>

      {/* Message + timestamp */}
      <div className="min-w-0 flex-1">
        <p className="leading-snug">{notification.message}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo}</p>
      </div>

      {/* Mark-read button — only shown when unread */}
      {!notification.read && (
        <button
          type="button"
          aria-label="Mark as read"
          disabled={isMarkingRead}
          onClick={(e) => {
            e.preventDefault(); // don't follow the Link when there is one
            e.stopPropagation();
            onMarkRead(notification.id);
          }}
          className="mt-0.5 shrink-0 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring group-hover/item:opacity-100"
        >
          {isMarkingRead ? (
            <Spinner className="size-4" label="Marking as read" />
          ) : (
            <CheckCheck className="size-4" aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );

  if (notification.resourceUrl) {
    return (
      <li className="group/item list-none">
        <Link href={notification.resourceUrl}>{content}</Link>
      </li>
    );
  }

  return <li className="group/item list-none">{content}</li>;
}
