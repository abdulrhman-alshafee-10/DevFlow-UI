import { Bot } from 'lucide-react';

interface ContextBadgeProps {
  label: string;
}

/**
 * Small pill shown in the chat header to indicate the current
 * task or project context the AI is aware of.
 */
export function ContextBadge({ label }: ContextBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
      <Bot className="size-2.5" aria-hidden="true" />
      {label}
    </span>
  );
}
