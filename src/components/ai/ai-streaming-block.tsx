'use client';

import { useEffect, useRef } from 'react';
import { X, AlertCircle } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { AIMarkdown } from './ai-markdown';
import type { AIStreamStatus } from '@/hooks/use-ai-stream';

interface AIStreamingBlockProps {
  /** The accumulated streamed text. */
  content: string;
  status: AIStreamStatus;
  error: string | null;
  /** Label shown above the block while streaming. */
  label?: string;
  /** Called when the user clicks the dismiss/stop button. */
  onDismiss?: () => void;
  className?: string;
}

/**
 * Reusable streaming output block.
 *
 * Shows a spinner + label while streaming, renders markdown once content
 * starts arriving, and surfaces error states with a clean message.
 * Auto-scrolls to the bottom as new tokens arrive.
 */
export function AIStreamingBlock({
  content,
  status,
  error,
  label = 'AI',
  onDismiss,
  className,
}: AIStreamingBlockProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll as content grows
  useEffect(() => {
    if (status === 'streaming') {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [content, status]);

  if (status === 'idle') return null;

  return (
    <div
      className={cn(
        'relative rounded-lg border border-border bg-muted/50 p-4',
        className,
      )}
      aria-live="polite"
      aria-label={label}
    >
      {/* Header row */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {status === 'streaming' && (
            <Spinner className="size-3.5" label="AI is responding" />
          )}
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">
            {label}
          </span>
        </div>

        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            onClick={onDismiss}
            aria-label="Dismiss"
          >
            <X className="size-3.5" aria-hidden="true" />
          </Button>
        )}
      </div>

      {/* Error state */}
      {status === 'error' && (
        <div className="flex items-start gap-2 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>{error ?? 'Something went wrong. Please try again.'}</p>
        </div>
      )}

      {/* Streamed content */}
      {content && <AIMarkdown content={content} />}

      {/* Blinking cursor while streaming */}
      {status === 'streaming' && (
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-primary align-middle"
        />
      )}

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}
