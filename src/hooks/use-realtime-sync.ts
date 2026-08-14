'use client';

import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useWebSocket } from './use-websocket';
import { useOrgStore } from '@/stores/org-store';
import { env } from '@/config/env';
import type { WsEvent } from '@/lib/ws/types';

/**
 * Subscribes to the org-scoped WebSocket and maps incoming events to
 * React Query cache invalidations.
 *
 * Called once from `WebSocketProvider` which lives in `DashboardShell`.
 */
export function useRealtimeSync() {
  const queryClient = useQueryClient();
  const activeOrgId = useOrgStore((s) => s.activeOrg?.id);

  const wsUrl = activeOrgId ? `${env.WS_URL}/ws/${activeOrgId}` : '';

  const handleEvent = useCallback(
    (event: WsEvent) => {
      switch (event.type) {
        // ── Task events ────────────────────────────────────────────────
        case 'task_created':
        case 'task_updated':
          // Invalidate both the board list and the detail cache
          queryClient.invalidateQueries({
            queryKey: ['tasks', event.payload.projectId],
          });
          if (event.type === 'task_updated') {
            queryClient.invalidateQueries({
              queryKey: ['task', event.payload.taskId],
            });
            queryClient.invalidateQueries({
              queryKey: ['task', event.payload.taskId, 'history'],
            });
          }
          break;

        case 'task_deleted':
          queryClient.invalidateQueries({
            queryKey: ['tasks', event.payload.projectId],
          });
          queryClient.removeQueries({
            queryKey: ['task', event.payload.taskId],
          });
          break;

        // ── Comment events ─────────────────────────────────────────────
        case 'comment_created':
        case 'comment_updated':
        case 'comment_deleted':
          queryClient.invalidateQueries({
            queryKey: ['comments', event.payload.taskId],
          });
          break;

        // ── Member events ──────────────────────────────────────────────
        case 'member_joined':
        case 'member_left':
          queryClient.invalidateQueries({
            queryKey: ['organizations', event.payload.orgId, 'members'],
          });
          break;

        default:
          break;
      }
    },
    [queryClient],
  );

  useWebSocket({
    url: wsUrl,
    onEvent: handleEvent,
    disabled: !activeOrgId,
  });
}
