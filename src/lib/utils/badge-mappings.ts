import type { BadgeVariant, Priority, Status } from '@/types';

/**
 * Design-locked mapping from {@link Priority} to {@link BadgeVariant}.
 *
 * Encoded as a `const` record with `satisfies Record<Priority, BadgeVariant>`
 * so TypeScript enforces exhaustiveness: adding a new `Priority` literal
 * without extending this table produces a compile-time error.
 */
const PRIORITY_TO_VARIANT = {
  low: 'secondary',
  medium: 'info',
  high: 'warning',
  urgent: 'destructive',
} as const satisfies Record<Priority, BadgeVariant>;

/**
 * Design-locked mapping from {@link Status} to {@link BadgeVariant}.
 *
 * Same `satisfies` guarantee as {@link PRIORITY_TO_VARIANT}: the compiler
 * refuses to build if a new `Status` literal is added without a matching
 * entry here.
 */
const STATUS_TO_VARIANT = {
  backlog: 'outline',
  todo: 'secondary',
  in_progress: 'info',
  in_review: 'warning',
  done: 'success',
  archived: 'outline',
} as const satisfies Record<Status, BadgeVariant>;

/**
 * Resolve the visual {@link BadgeVariant} that corresponds to a
 * {@link Priority}.
 *
 * Pure, deterministic, side-effect free.
 */
export function priorityToBadgeVariant(priority: Priority): BadgeVariant {
  return PRIORITY_TO_VARIANT[priority];
}

/**
 * Resolve the visual {@link BadgeVariant} that corresponds to a
 * {@link Status}.
 *
 * Pure, deterministic, side-effect free.
 */
export function statusToBadgeVariant(status: Status): BadgeVariant {
  return STATUS_TO_VARIANT[status];
}

/**
 * Props consumed by {@link resolveBadgeVariant} — the same shape the
 * `<Badge />` component accepts when it needs to pick a variant.
 */
export interface ResolveBadgeVariantProps {
  priority?: Priority;
  status?: Status;
  variant?: BadgeVariant;
}

/**
 * Pick the effective {@link BadgeVariant} for a `<Badge />` given the
 * consumer's props.
 *
 * Precedence, highest to lowest:
 *   1. `priority` (mapped via {@link priorityToBadgeVariant})
 *   2. `status`   (mapped via {@link statusToBadgeVariant})
 *   3. `variant`  (used verbatim)
 *   4. `'default'`
 *
 * Pure, deterministic, side-effect free — does not mutate `props`.
 */
export function resolveBadgeVariant(
  props: ResolveBadgeVariantProps,
): BadgeVariant {
  if (props.priority !== undefined) {
    return priorityToBadgeVariant(props.priority);
  }
  if (props.status !== undefined) {
    return statusToBadgeVariant(props.status);
  }
  if (props.variant !== undefined) {
    return props.variant;
  }
  return 'default';
}
