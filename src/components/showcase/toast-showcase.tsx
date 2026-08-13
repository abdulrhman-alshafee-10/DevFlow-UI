'use client';

import { Button, toast } from '@/components/ui';
import { Card, CardContent } from '@/components/ui/card';

export function ToastShowcase() {
  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Variants
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" onClick={() => toast('Neutral toast')}>
              Neutral
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success('Saved changes')}
            >
              Success
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast.error('Something went wrong', {
                  description: 'Try again later.',
                })
              }
            >
              Error
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast.info('FYI', {
                  description: 'This is informational.',
                })
              }
            >
              Info
            </Button>
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            With action
          </h3>
          <p className="mb-3 text-sm text-muted-foreground">
            Toasts can offer a single recovery affordance. The action button
            dismisses the toast automatically once clicked.
          </p>
          <Button
            variant="destructive"
            onClick={() =>
              toast.error('Save failed', {
                description: 'Network error.',
                action: {
                  label: 'Retry',
                  onClick: () => toast.success('Retried!'),
                },
              })
            }
          >
            Trigger retryable error
          </Button>
        </section>
      </CardContent>
    </Card>
  );
}
