import { create } from 'zustand';

/**
 * WebSocket connection status values.
 *
 * - `connecting`  — initial or reconnecting attempt in progress
 * - `connected`   — socket is open and receiving messages
 * - `disconnected`— socket closed, backoff timer running before next attempt
 */
export type WsStatus = 'connecting' | 'connected' | 'disconnected';

interface WsState {
  status: WsStatus;
}

interface WsActions {
  setStatus: (status: WsStatus) => void;
}

/**
 * Tiny global store for WebSocket status.
 *
 * Kept separate so the Topbar's `ConnectionStatusDot` can read it
 * without prop-drilling through `DashboardShell` → `Topbar`.
 */
export const useWsStore = create<WsState & WsActions>((set) => ({
  status: 'connecting',
  setStatus: (status) => set({ status }),
}));
