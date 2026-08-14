'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Send, Bot, RotateCcw } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useAIStream } from '@/hooks/use-ai-stream';
import { streamChat } from '@/lib/api/ai';
import type { ChatMessage } from '@/lib/api/ai';
import { ChatBubble } from './chat-bubble';
import { TypingIndicator } from './typing-indicator';
import { ContextBadge } from './context-badge';

export interface AIChatContext {
  type: 'task' | 'project';
  id: string;
  label: string;
}

interface AIChatProps {
  context?: AIChatContext;
  placeholder?: string;
  /** Tailwind height class applied to the message list, e.g. "h-96". */
  heightClass?: string;
}

/**
 * Conversational AI chat panel.
 *
 * - Sends the full message history on every request so the model has context.
 * - Streams the assistant reply token-by-token via `useAIStream`.
 * - Auto-scrolls to the bottom as new tokens arrive.
 * - Renders markdown (including code blocks) in assistant messages.
 */
export function AIChat({
  context,
  placeholder = 'Ask anything…',
  heightClass = 'h-[420px]',
}: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { content, isStreaming, status, error, start, reset } = useAIStream();

  // Auto-scroll as new tokens arrive
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [content, messages, isStreaming]);

  // Once streaming finishes, commit the accumulated content as a message
  useEffect(() => {
    if (status === 'done' && content) {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && last.content === '') {
          return [...prev.slice(0, -1), { role: 'assistant', content }];
        }
        return prev;
      });
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const userMsg: ChatMessage = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Add an empty placeholder the second effect will fill in
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    await start((onChunk, signal) =>
      streamChat(
        [...messages, userMsg],
        context ? { type: context.type, id: context.id } : undefined,
        onChunk,
        signal,
      ),
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(e as unknown as FormEvent);
    }
  };

  const clearChat = () => {
    reset();
    setMessages([]);
    setInput('');
  };

  const isEmpty = messages.length === 0 && !isStreaming;

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <Bot className="size-4 text-primary" aria-hidden="true" />
          <span className="text-sm font-semibold">AI Assistant</span>
          {context && <ContextBadge label={context.label} />}
        </div>
        {!isEmpty && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 text-xs text-muted-foreground"
            onClick={clearChat}
            aria-label="Clear conversation"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Clear
          </Button>
        )}
      </div>

      {/* Message list */}
      <div
        className={cn('flex-1 overflow-y-auto', heightClass)}
        aria-live="polite"
        aria-label="Chat messages"
      >
        <div className="space-y-4 px-4 py-4">
          {isEmpty && (
            <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
              <Bot className="size-8 opacity-30" aria-hidden="true" />
              <p className="text-sm">
                {context
                  ? `Ask me anything about this ${context.type}.`
                  : 'How can I help you today?'}
              </p>
            </div>
          )}

          {messages.map((msg, i) => {
            const isLastAssistant =
              msg.role === 'assistant' &&
              i === messages.length - 1 &&
              isStreaming;

            return (
              <ChatBubble
                key={i}
                message={isLastAssistant ? { ...msg, content } : msg}
                isStreaming={isLastAssistant}
              />
            );
          })}

          {/* Typing indicator while waiting for the first token */}
          {isStreaming && content === '' && <TypingIndicator />}

          {/* Error */}
          {status === 'error' && (
            <div className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error ?? 'Something went wrong. Please try again.'}
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-border px-3 py-2"
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isStreaming ? 'AI is responding…' : placeholder}
            disabled={isStreaming}
            rows={1}
            aria-label="Chat input"
            className={cn(
              'flex-1 resize-none rounded-md border border-input bg-background px-3 py-2',
              'text-sm placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'max-h-32 overflow-y-auto',
            )}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = 'auto';
              el.style.height = `${el.scrollHeight}px`;
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isStreaming || !input.trim()}
            aria-label="Send message"
            className="shrink-0"
          >
            {isStreaming ? (
              <Spinner className="size-4" label="Sending" />
            ) : (
              <Send className="size-4" aria-hidden="true" />
            )}
          </Button>
        </div>
        <p className="mt-1 text-right text-[10px] text-muted-foreground">
          Enter to send · Shift+Enter for new line
        </p>
      </form>
    </div>
  );
}
