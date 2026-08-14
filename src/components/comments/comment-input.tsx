'use client';

import { useState, useRef } from 'react';
import { Eye, EyeOff, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { MarkdownContent } from './markdown-content';
import { cn } from '@/lib/utils/cn';

interface CommentInputProps {
  /** Called when the user submits a non-empty body. Input is cleared after. */
  onSubmit: (body: string) => void;
  isPending?: boolean;
  /** Placeholder for the textarea. */
  placeholder?: string;
  /** Pre-fill value — used when editing an existing comment. */
  defaultValue?: string;
  /** Label for the submit button. */
  submitLabel?: string;
  /** Optional cancel callback — shows a Cancel button when provided. */
  onCancel?: () => void;
  autoFocus?: boolean;
}

/**
 * Markdown-aware comment input.
 *
 * - Write/preview tabs above the textarea
 * - Keyboard shortcut: Ctrl/Cmd+Enter submits
 * - Empty body is rejected
 */
export function CommentInput({
  onSubmit,
  isPending,
  placeholder = 'Add a comment… (Markdown supported)',
  defaultValue = '',
  submitLabel = 'Comment',
  onCancel,
  autoFocus,
}: CommentInputProps) {
  const [body, setBody] = useState(defaultValue);
  const [previewing, setPreviewing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit() {
    const trimmed = body.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setBody('');
    setPreviewing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Write / Preview toggle */}
      <div className="flex items-center gap-1 border-b border-border pb-1">
        <button
          type="button"
          onClick={() => {
            setPreviewing(false);
            setTimeout(() => textareaRef.current?.focus(), 0);
          }}
          className={cn(
            'rounded-md px-3 py-1 text-xs font-medium transition-colors',
            !previewing
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
          aria-pressed={!previewing}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setPreviewing(true)}
          disabled={!body.trim()}
          className={cn(
            'flex items-center gap-1 rounded-md px-3 py-1 text-xs font-medium transition-colors',
            previewing
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground hover:text-foreground disabled:opacity-40',
          )}
          aria-pressed={previewing}
        >
          {previewing ? (
            <EyeOff className="size-3" aria-hidden="true" />
          ) : (
            <Eye className="size-3" aria-hidden="true" />
          )}
          Preview
        </button>
        <span className="ml-auto text-[10px] text-muted-foreground">
          Ctrl+Enter to submit
        </span>
      </div>

      {/* Textarea or preview */}
      {previewing ? (
        <div className="min-h-[80px] rounded-md border border-border bg-muted/30 px-3 py-2">
          {body.trim() ? (
            <MarkdownContent>{body}</MarkdownContent>
          ) : (
            <p className="text-xs italic text-muted-foreground">
              Nothing to preview yet.
            </p>
          )}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          autoFocus={autoFocus}
          className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50"
          disabled={isPending}
          aria-label="Comment body"
        />
      )}

      {/* Action row */}
      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          onClick={handleSubmit}
          isLoading={isPending}
          loadingText="Posting…"
          disabled={!body.trim()}
        >
          <Send className="size-3.5" aria-hidden="true" />
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
