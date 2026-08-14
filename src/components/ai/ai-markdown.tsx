import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

import { cn } from '@/lib/utils/cn';

// ── Code block ─────────────────────────────────────────────────────────────

/**
 * Renders fenced code blocks with a language label and monospace styling.
 * We intentionally avoid `react-syntax-highlighter` (heavy bundle) and
 * instead rely on Tailwind's `prose` code styles + a subtle tinted surface.
 */
function CodeBlock({
  className,
  children,
  inline,
}: {
  className?: string;
  children?: React.ReactNode;
  inline?: boolean;
}) {
  const language = className?.replace('language-', '') ?? '';

  if (inline) {
    return (
      <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground">
        {children}
      </code>
    );
  }

  return (
    <div className="relative my-3 overflow-hidden rounded-lg border border-border bg-muted">
      {language && (
        <div className="border-b border-border bg-muted px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {language}
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-3 text-[0.82rem] leading-relaxed">
        <code className="font-mono text-foreground">{children}</code>
      </pre>
    </div>
  );
}

// ── Markdown component map ─────────────────────────────────────────────────

const components: Components = {
  code: ({ className, children, node: _node, ...props }) => (
    <CodeBlock
      className={className}
      inline={'inline' in props ? (props.inline as boolean) : false}
    >
      {children}
    </CodeBlock>
  ),
  p: ({ children }) => (
    <p className="mb-2 leading-relaxed last:mb-0">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-2 list-disc space-y-1 pl-5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-5">{children}</ol>
  ),
  li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
  h1: ({ children }) => (
    <h1 className="mb-2 mt-4 text-lg font-bold first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-1.5 mt-3 text-base font-semibold first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-1 mt-2 text-sm font-semibold first:mt-0">{children}</h3>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-primary pl-3 text-muted-foreground">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-2 hover:text-primary/80"
    >
      {children}
    </a>
  ),
};

// ── Public component ───────────────────────────────────────────────────────

interface AIMarkdownProps {
  content: string;
  className?: string;
}

/**
 * Renders AI-generated markdown with DevFlow styling.
 * Used by chat bubbles, analysis panels, and project summaries.
 */
export function AIMarkdown({ content, className }: AIMarkdownProps) {
  return (
    <div className={cn('text-sm text-foreground', className)}>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}
