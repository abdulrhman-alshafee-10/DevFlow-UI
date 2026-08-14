'use client';

import { useRealtimeSync } from '@/hooks/use-realtime-sync';

/**
 * Mounts the WebSocket realtime sync inside the dashboard layout.
 *
 * Renders nothing — its only job is to call `useRealtimeSync` once so the
 * WebSocket lifecycle is tied to the dashboard being mounted.
 * Placed inside `DashboardShell` so it has access to `QueryClient` and
 * the org store.
 */
export function WebSocketProvider() {
  useRealtimeSync();
  return null;
}
