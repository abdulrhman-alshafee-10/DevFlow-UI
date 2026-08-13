'use client';

import { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // In a real app we would ship this to an error tracker
    // (Sentry, Datadog, etc.).
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <div className="space-y-2">
        <p className="font-mono text-sm text-primary">error</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Something broke on our side
        </h1>
        <p className="max-w-md text-muted-foreground">
          The page failed to render. You can try again — if the problem
          persists, refresh the page or contact support.
        </p>
        {error.digest ? (
          <p className="font-mono text-xs text-muted-foreground">
            digest: {error.digest}
          </p>
        ) : null}
      </div>

      <Button onClick={reset} leftIcon={<RotateCcw aria-hidden="true" />}>
        Try again
      </Button>
    </div>
  );
}
