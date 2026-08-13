import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      {/* Ambient grid */}
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none absolute inset-0 opacity-60"
      />

      <div className="relative space-y-2">
        <p className="font-mono text-sm text-primary">404</p>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Page not found
        </h1>
        <p className="max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>

      <div className="relative flex items-center gap-3">
        <Link href="/dashboard" className={cn(buttonVariants({ size: 'lg' }))}>
          <LayoutDashboard aria-hidden="true" />
          Go to Dashboard
        </Link>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }))}
        >
          Home
        </Link>
      </div>
    </div>
  );
}
