'use client';

import { useEffect, useRef, useCallback } from 'react';

import { useWsStore } from '@/stores/ws-store';
import { parseWsEvent } from '@/lib/ws/types';
import type { WsEvent } from '@/lib/ws/types';

// ── Config ─────────────────────────────────────────────────────────────────

/** Time between reconnection attempts (exponential back-off caps here). */
const MAX_BACKOFF_MS = 30_000;
/** Initial reconnect delay. */
const BASE_BACKOFF_MS = 1_000;
/** How often the client pings the server to detect silent disconnects. */
const HEARTBEAT_INTERVAL_MS = 25_000;

// ── Types ──────────────────────────────────────────────────────────────────

interface UseWebSocketOptions {
  /** Full WebSocket URL, e.g. `ws://localhost:8000/ws/org123`. */
  url: string;
  /** Called for every well-formed incoming event. */
  onEvent: (event: WsEvent) => void;
  /** Skip connecting (e.g. no active org yet). */
  disabled?: boolean;
}

/**
 * Low-level WebSocket hook.
 *
 * Responsibilities:
 * - Open + close the socket when the URL changes or the component unmounts
 * - Exponential back-off reconnection on unexpected close / error
 * - Heartbeat (client-side ping every 25 s) to detect silent disconnects
 * - Write `WsStatus` into `useWsStore` so any component can read it
 *
 * Does NOT know about React Query — that logic lives in `useRealtimeSync`.
 */
export function useWebSocket({
  url,
  onEvent,
  disabled = false,
}: UseWebSocketOptions) {
  const setStatus = useWsStore((s) => s.setStatus);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heartbeatTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const attemptRef = useRef(0);
  const unmountedRef = useRef(false);

  // Stable ref for the caller's event handler to avoid re-creating the socket
  const onEventRef = useRef(onEvent);
  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  const clearTimers = useCallback(() => {
    if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    if (heartbeatTimer.current) clearInterval(heartbeatTimer.current);
    reconnectTimer.current = null;
    heartbeatTimer.current = null;
  }, []);

  const connect = useCallback(() => {
    if (unmountedRef.current || disabled) return;
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    setStatus('connecting');

    let ws: WebSocket;
    try {
      ws = new WebSocket(url);
    } catch {
      // URL may be invalid on first render before org is loaded
      setStatus('disconnected');
      return;
    }

    socketRef.current = ws;

    ws.onopen = () => {
      if (unmountedRef.current) {
        ws.close();
        return;
      }
      attemptRef.current = 0;
      setStatus('connected');

      // Start heartbeat
      heartbeatTimer.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping' }));
        }
      }, HEARTBEAT_INTERVAL_MS);
    };

    ws.onmessage = (event) => {
      const parsed = parseWsEvent(event.data as string);
      if (parsed && parsed.type !== 'ping') {
        onEventRef.current(parsed);
      }
    };

    ws.onclose = () => {
      if (unmountedRef.current) return;
      clearTimers();
      setStatus('disconnected');
      scheduleReconnect();
    };

    ws.onerror = () => {
      // onerror is always followed by onclose, so we handle reconnect there
    };
  }, [url, disabled, setStatus, clearTimers]);

  const scheduleReconnect = useCallback(() => {
    if (unmountedRef.current || disabled) return;
    const backoff = Math.min(
      BASE_BACKOFF_MS * 2 ** attemptRef.current,
      MAX_BACKOFF_MS,
    );
    attemptRef.current += 1;
    reconnectTimer.current = setTimeout(connect, backoff);
  }, [connect, disabled]);

  // Open on mount / when url or disabled changes; close on unmount
  useEffect(() => {
    unmountedRef.current = false;

    if (!disabled && url) {
      connect();
    } else {
      setStatus('disconnected');
    }

    return () => {
      unmountedRef.current = true;
      clearTimers();
      if (socketRef.current) {
        socketRef.current.onclose = null; // prevent reconnect on intentional close
        socketRef.current.close();
        socketRef.current = null;
      }
      setStatus('disconnected');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, disabled]);
}
