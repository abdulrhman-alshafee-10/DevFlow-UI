'use client';

import { useState, useRef, useCallback } from 'react';

export type AIStreamStatus = 'idle' | 'streaming' | 'done' | 'error';

export interface UseAIStreamResult {
  /** The accumulated text received so far. */
  content: string;
  status: AIStreamStatus;
  error: string | null;
  isStreaming: boolean;
  /**
   * Start the stream by calling `streamFn`.
   * `streamFn` receives an `onChunk` callback and an `AbortSignal` and
   * should return a Promise that resolves when streaming ends.
   */
  start: (
    streamFn: (
      onChunk: (token: string) => void,
      signal: AbortSignal,
    ) => Promise<void>,
  ) => Promise<void>;
  /** Abort an in-flight stream. */
  abort: () => void;
  /** Reset state back to idle. */
  reset: () => void;
}

/**
 * Generic SSE streaming hook.
 *
 * Manages accumulated content, streaming status, and abort control.
 * The actual API call is provided by the caller so this hook stays
 * transport-agnostic and testable.
 *
 * Usage:
 * ```ts
 * const { content, isStreaming, start } = useAIStream();
 * start((onChunk, signal) => streamTaskAnalysis(taskId, onChunk, signal));
 * ```
 */
export function useAIStream(): UseAIStreamResult {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<AIStreamStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setContent('');
    setStatus('idle');
    setError(null);
  }, []);

  const start = useCallback(
    async (
      streamFn: (
        onChunk: (token: string) => void,
        signal: AbortSignal,
      ) => Promise<void>,
    ) => {
      // Abort any running stream before starting a new one
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setContent('');
      setError(null);
      setStatus('streaming');

      try {
        await streamFn(
          (token) => setContent((prev) => prev + token),
          controller.signal,
        );
        setStatus('done');
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          setStatus('idle');
          return;
        }
        const message =
          err instanceof Error ? err.message : 'An unexpected error occurred.';
        setError(message);
        setStatus('error');
      }
    },
    [],
  );

  return {
    content,
    status,
    error,
    isStreaming: status === 'streaming',
    start,
    abort,
    reset,
  };
}
