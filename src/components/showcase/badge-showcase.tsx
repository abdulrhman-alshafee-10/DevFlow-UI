'use client';

import { Check, Flag } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ALL_PRIORITIES, ALL_STATUSES } from '@/types';

/**
 * Human-readable status labels. `Status` uses snake_case values so the
 * type stays serializable, but we surface capitalized labels in the UI.
 */
const STATUS_LABELS: Record<(typeof ALL_STATUSES)[number], string> = {
  backlog: 'Backlog',
  todo: 'To do',
  in_progress: 'In progress',
  in_review: 'In review',
  done: 'Done',
  archived: 'Archived',
};

export function BadgeShowcase() {
  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Legacy variants
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Priorities
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            {ALL_PRIORITIES.map((priority) => (
              <Badge key={priority} priority={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Badge>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Statuses
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            {ALL_STATUSES.map((status) => (
              <Badge key={status} status={status}>
                {STATUS_LABELS[status]}
              </Badge>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            With icons
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success" icon={<Check />}>
              Verified
            </Badge>
            <Badge priority="urgent" icon={<Flag />}>
              Flagged
            </Badge>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
