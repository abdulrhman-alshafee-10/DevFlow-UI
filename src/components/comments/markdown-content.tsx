import ReactMarkdown from 'react-markdown';

import { cn } from '@/lib/utils/cn';

interface MarkdownContentProps {
  children: string;
  className?: string;
}

/**
 * Renders a Markdown string as styled HTML.
 *
 * Uses `react-markdown` with a curated set of Tailwind prose classes
 * applied inline — no `@tailwindcss/typography` plugin needed.
 */
export function MarkdownContent({ children, className }: MarkdownContentProps) {
  return (
    <div
      className={cn(
        // Block elements
        '[&_p:last-child]:mb-0 [&_p]:mb-2',
        '[&_h1]:mb-2 [&_h1]:text-lg [&_h1]:font-bold',
        '[&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold',
        '[&_h3]:mb-1.5 [&_h3]:text-sm [&_h3]:font-semibold',
        // Lists
        '[&_ul]:mb-2 [&_ul]:ml-4 [&_ul]:list-disc',
        '[&_ol]:mb-2 [&_ol]:ml-4 [&_ol]:list-decimal',
        '[&_li]:mb-0.5',
        // Inline
        '[&_strong]:font-semibold',
        '[&_em]:italic',
        '[&_a:hover]:opacity-80 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2',
        // Code
        '[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.8em]',
        '[&_pre]:mb-2 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3',
        '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
        // Blockquote
        '[&_blockquote]:mb-2 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground',
        // HR
        '[&_hr]:my-3 [&_hr]:border-border',
        'text-sm leading-relaxed text-foreground/90',
        className,
      )}
    >
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
