import { Bot } from 'lucide-react';

/**
 * Animated three-dot indicator shown while waiting for the
 * first streaming token from the AI.
 */
export function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Bot className="size-3.5" aria-hidden="true" />
      </span>
      <div
        className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-muted px-4 py-3"
        aria-label="AI is typing"
        role="status"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
            style={{ animationDelay: `${i * 150}ms` }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
