import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

export interface StatCardProps {
  label: string;
  value: number | string | undefined;
  icon: LucideIcon;
  /** Tailwind color class applied to the icon background, e.g. `"bg-blue-500/10"`. */
  iconColor?: string;
  /** Tailwind text-color class applied to the icon, e.g. `"text-blue-500"`. */
  iconTextColor?: string;
  isLoading?: boolean;
  className?: string;
}

/**
 * Single metric tile used on the Dashboard landing page.
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = 'bg-primary/10',
  iconTextColor = 'text-primary',
  isLoading,
  className,
}: StatCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardContent className="flex items-center gap-4 p-5">
        <span
          aria-hidden="true"
          className={cn(
            'grid size-10 shrink-0 place-items-center rounded-lg',
            iconColor,
          )}
        >
          <Icon className={cn('size-5', iconTextColor)} />
        </span>

        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          {isLoading ? (
            <Spinner className="mt-1 h-5 w-5" />
          ) : (
            <p className="mt-0.5 text-2xl font-bold tabular-nums">
              {value ?? '—'}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
