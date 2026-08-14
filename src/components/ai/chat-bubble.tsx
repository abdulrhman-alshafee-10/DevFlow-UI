'use client';

import { Bot, User } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { AIMarkdown } from './ai-markdown';
import type { ChatMessage } from '@/lib/api/ai';

interface ChatBubbleProps {
  message: ChatMessage;
  /** When true, renders a blinking cursor at the end of the content. */
  isStreaming?: boolean;
}

export function ChatBubble({ message, isStreaming }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex items-start gap-2.5',
        isUser ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      {/* Avatar */}
      <span
        className={cn(
          'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground',
        )}
        aria-hidden="true"
      >
        {isUser ? <User className="size-3.5" /> : <Bot className="size-3.5" />}
      </span>

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm',
          isUser
            ? 'rounded-tr-sm bg-primary text-primary-foreground'
            : 'rounded-tl-sm bg-muted text-foreground',
        )}
      >
        {isUser ? (
          <p className="leading-relaxed">{message.content}</p>
        ) : (
          <AIMarkdown content={message.content} />
        )}

        {isStreaming && (
          <span
            aria-hidden="true"
            className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-current align-middle opacity-60"
          />
        )}
      </div>
    </div>
  );
}
