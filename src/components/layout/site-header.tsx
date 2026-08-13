import Link from 'next/link';
import { Github } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { cn } from '@/lib/utils/cn';
import { siteConfig } from '@/config/site';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/70 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-lg font-bold tracking-tight"
          >
            <span
              aria-hidden="true"
              className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-soft"
            >
              <span className="text-sm font-bold">D</span>
            </span>
            {siteConfig.name}
          </Link>
          <Badge variant="secondary" className="hidden sm:inline-flex">
            Phase 1 · Foundation
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            aria-label="View on GitHub"
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
          >
            <Github aria-hidden="true" />
            <span className="sr-only">GitHub</span>
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
