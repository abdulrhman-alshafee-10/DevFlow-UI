import Link from 'next/link';
import { Home } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <div className="space-y-2">
        <p className="font-mono text-sm text-primary">404</p>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Page not found
        </h1>
        <p className="max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Head back home and try again.
        </p>
      </div>
      <Link href="/" className={cn(buttonVariants({ size: 'lg' }))}>
        <Home aria-hidden="true" />
        Back to home
      </Link>
    </div>
  );
}
