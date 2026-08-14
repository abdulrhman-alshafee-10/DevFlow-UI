'use client';

import { useWsStore } from '@/stores/ws-store';
import { cn } from '@/lib/utils/cn';
import type { WsStatus } from '@/stores/ws-store';

const STATUS_CONFIG: Record<
  WsStatus,
  { dot: string; ring: string; label: string }
> = {
  connected: {
    dot: 'bg-success',
    ring: 'ring-success/30',
    label: 'Realtime: connected',
  },
  connecting: {
    dot: 'bg-warning animate-pulse',
    ring: 'ring-warning/30',
    label: 'Realtime: connecting…',
  },
  disconnected: {
    dot: 'bg-destructive',
    ring: 'ring-destructive/30',
    label: 'Realtime: disconnected',
  },
};

/**
 * A small coloured dot that reflects the WebSocket connection status.
 * Shown in the Topbar between the notification bell and the theme toggle.
 *
 * - Green  = connected
 * - Amber  = connecting / reconnecting (pulsing)
 * - Red    = disconnected
 *
 * Fully accessible: `role="status"` + `aria-label` announce state to
 * screen readers without visible text.
 */
export function ConnectionStatusDot() {
  const status = useWsStore((s) => s.status);
  const { dot, ring, label } = STATUS_CONFIG[status];

  return (
    <span
      role="status"
      aria-label={label}
      title={label}
      className={cn('inline-block size-2.5 rounded-full ring-2', dot, ring)}
    />
  );
}
