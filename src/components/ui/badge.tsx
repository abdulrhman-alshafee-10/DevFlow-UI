import type { HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { resolveBadgeVariant } from '@/lib/utils';
import { cn } from '@/lib/utils/cn';
import type { Priority, Status } from '@/types';

export const badgeVariants = cva(
  [
    'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5',
    'text-xs font-medium tracking-tight',
    'transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  ].join(' '),
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/85',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border-border text-foreground',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90',
        success:
          'border-transparent bg-success/15 text-success dark:bg-success/25',
        warning:
          'border-transparent bg-warning/15 text-warning dark:bg-warning/25',
        info: 'border-transparent bg-info/15 text-info dark:bg-info/25',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

/**
 * Props accepted by the DevFlow {@link Badge} component.
 *
 * In addition to the legacy `variant` prop (kept unchanged for existing
 * consumers), a Badge can be driven by a domain-aware `priority` or
 * `status`, and can render an optional decorative `icon` before its
 * children.
 *
 * Variant resolution follows the precedence:
 *   `priority` > `status` > `variant` > `'default'`
 *
 * The visual variant is picked by {@link resolveBadgeVariant} — see
 * `src/lib/utils/badge-mappings.ts` for the design-locked
 * Priority→Variant and Status→Variant tables.
 */
export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  /**
   * Domain priority. When provided, wins over `status` and `variant` and
   * maps to a `BadgeVariant` via `priorityToBadgeVariant`.
   */
  priority?: Priority;

  /**
   * Domain status. When provided (and `priority` is not), wins over
   * `variant` and maps to a `BadgeVariant` via `statusToBadgeVariant`.
   */
  status?: Status;

  /**
   * Optional decorative element rendered before the badge's children.
   * Wrapped in an `aria-hidden="true"` span so it does not pollute the
   * accessible name of the badge.
   */
  icon?: ReactNode;
}

/**
 * DevFlow Badge — a small pill used to surface priority, status, and
 * generic labels.
 *
 * The visual variant is resolved from the incoming props via
 * {@link resolveBadgeVariant} with the precedence
 * `priority > status > variant > 'default'`, ensuring domain-driven
 * callers (`<Badge priority="urgent" />`, `<Badge status="in_progress" />`)
 * consistently render the design-locked colors while legacy callers that
 * pass an explicit `variant` continue to work unchanged.
 *
 * Rendered as a `<span>` (never an interactive element) and safe to use
 * inside server components: no `'use client'` directive, no
 * `dangerouslySetInnerHTML`, no client-only APIs.
 */
export function Badge({
  priority,
  status,
  variant,
  icon,
  className,
  children,
  ...rest
}: BadgeProps) {
  // `cva` types `variant` as `BadgeVariant | null | undefined`; normalize
  // `null` → `undefined` so the resolver's `variant?: BadgeVariant`
  // signature is satisfied. Precedence lives inside `resolveBadgeVariant`:
  // `priority > status > variant > 'default'`.
  const resolvedVariant = resolveBadgeVariant({
    priority,
    status,
    variant: variant ?? undefined,
  });

  return (
    <span
      className={cn(badgeVariants({ variant: resolvedVariant }), className)}
      {...rest}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className="inline-flex shrink-0 [&_svg]:size-3"
        >
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}
