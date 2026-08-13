import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { siteConfig } from '@/config/site';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div aria-hidden="true" className="bg-radial-fade absolute inset-0" />
      <div
        aria-hidden="true"
        className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent_70%)]"
      />

      <div className="container relative flex flex-col items-center py-20 text-center md:py-28">
        <Badge variant="secondary" className="mb-6 gap-1.5">
          <Sparkles className="size-3" aria-hidden="true" />
          Design System · v0.1
        </Badge>

        <h1 className="max-w-4xl font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
          The foundation for a{' '}
          <span className="bg-gradient-to-r from-primary via-brand-400 to-brand-600 bg-clip-text text-transparent">
            beautiful SaaS frontend
          </span>
          .
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          {siteConfig.description}
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="#components"
            className={cn(buttonVariants({ size: 'lg' }))}
          >
            Explore components
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="#tokens"
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
          >
            See design tokens
          </Link>
        </div>
      </div>
    </section>
  );
}
