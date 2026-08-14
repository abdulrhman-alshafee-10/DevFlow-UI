'use client';

import {
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Pencil } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

interface InlineEditFieldProps {
  /** Current value shown in display mode. */
  value: string;
  /** Called when the user commits a new value (blur or Enter). */
  onSave: (value: string) => void;
  /** Render as `<textarea>` instead of a single-line `<input>`. */
  multiline?: boolean;
  placeholder?: string;
  /** Extra classes for the outer wrapper. */
  className?: string;
  /** Display-mode renderer. Receives the current value. */
  renderDisplay?: (value: string) => ReactNode;
  disabled?: boolean;
  /** aria-label for the edit button. */
  label?: string;
}

/**
 * Inline editable field.
 *
 * Click the pencil icon (or the display text) to enter edit mode.
 * - Single-line: Enter commits, Escape cancels.
 * - Multiline: Shift+Enter inserts newline, Enter commits, Escape cancels.
 * Blur always commits if the value changed.
 */
export function InlineEditField({
  value,
  onSave,
  multiline = false,
  placeholder = 'Click to edit…',
  className,
  renderDisplay,
  disabled,
  label = 'Edit field',
}: InlineEditFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  // Sync draft when the external value changes (e.g. after a save)
  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  function enter() {
    if (disabled) return;
    setDraft(value);
    setEditing(true);
  }

  function commit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onSave(trimmed);
    setEditing(false);
  }

  function cancel() {
    setDraft(value);
    setEditing(false);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      cancel();
      return;
    }
    if (e.key === 'Enter') {
      if (!multiline || !e.shiftKey) {
        e.preventDefault();
        commit();
      }
    }
  }

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  if (editing) {
    const sharedClass = cn(
      'w-full rounded-md border border-primary bg-background px-2 py-1 text-sm',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    );

    return multiline ? (
      <textarea
        ref={inputRef}
        value={draft}
        rows={4}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        className={cn(sharedClass, 'resize-none', className)}
        aria-label={label}
      />
    ) : (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        className={cn(sharedClass, className)}
        aria-label={label}
      />
    );
  }

  return (
    <div
      className={cn('group flex items-start gap-1.5', className)}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={enter}
      onKeyDown={(e) => e.key === 'Enter' && enter()}
      aria-label={`${label} — click to edit`}
    >
      <span className={cn('flex-1', !value && 'italic text-muted-foreground')}>
        {renderDisplay ? renderDisplay(value) : value || placeholder}
      </span>
      {!disabled && (
        <Pencil
          className="mt-0.5 size-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
