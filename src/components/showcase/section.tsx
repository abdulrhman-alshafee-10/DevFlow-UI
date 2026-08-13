import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

interface SectionProps {
  id?: string;
  title: string;
  description?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Uniform section wrapper used across the design system showcase.
 * Guarantees vertical rhythm, heading hierarchy, and consistent
 * container widths.
 */
export function ShowcaseSection({
  id,
  title,
  description,
  eyebrow,
  children,
  className,
}: SectionProps) {
  return (
    <section id={id} className={cn('scroll-mt-24 py-12 md:py-16', className)}>
      <div className="container">
        <header className="mb-8 max-w-2xl">
          {eyebrow ? (
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 text-base text-muted-foreground">
              {description}
            </p>
          ) : null}
        </header>
        {children}
      </div>
    </section>
  );
}
