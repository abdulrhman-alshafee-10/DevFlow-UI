'use client';

import { useState } from 'react';
import { Bot, X } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { buttonVariants } from '@/components/ui/button';
import { AIChat } from './ai-chat';
import type { AIChatContext } from './ai-chat';

interface AIAssistantPanelProps {
  context?: AIChatContext;
  /** Extra classes for the container. */
  className?: string;
}

/**
 * Collapsible AI assistant panel.
 * Used on task detail pages and the project dashboard.
 * Starts collapsed; clicking the header expands the chat.
 */
export function AIAssistantPanel({
  context,
  className,
}: AIAssistantPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn('rounded-lg border border-border', className)}>
      {/* Trigger header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="ai-panel-body"
        className={cn(
          'flex w-full items-center justify-between gap-2 px-3 py-2.5',
          'rounded-lg transition-colors hover:bg-muted/50',
          open && 'rounded-b-none border-b border-border',
        )}
      >
        <div className="flex items-center gap-2">
          <Bot className="size-4 text-primary" aria-hidden="true" />
          <span className="text-sm font-semibold">Ask AI</span>
          {context && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              {context.label}
            </span>
          )}
        </div>
        <span
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'size-6 text-muted-foreground',
          )}
          aria-hidden="true"
        >
          {open ? <X className="size-3.5" /> : <Bot className="size-3.5" />}
        </span>
      </button>

      {/* Collapsible body */}
      {open && (
        <div id="ai-panel-body">
          <AIChat
            context={context}
            heightClass="h-80"
            placeholder={
              context ? `Ask about this ${context.type}…` : 'Ask me anything…'
            }
          />
        </div>
      )}
    </div>
  );
}
