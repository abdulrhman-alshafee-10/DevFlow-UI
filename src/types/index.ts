/**
 * Shared application types.
 *
 * Feature-specific types (Task, Project, User, etc.) will land in
 * their own files under `src/types/` as later phases introduce them.
 */

/** A record with well-known ISO-8601 timestamp fields. */
export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

/** Standard paginated response envelope from the DevFlow API. */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Priority levels applied to DevFlow tasks, ordered lowest → highest.
 *
 * Used to drive Badge styling, sort order, and filter controls across
 * the task management surfaces.
 */
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Lifecycle status of a DevFlow task, ordered from creation to archival.
 *
 * Drives Badge styling, board columns, and workflow transitions.
 */
export type Status =
  'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done' | 'archived';

/**
 * Visual variants supported by the DevFlow Badge component.
 *
 * Includes the semantic states (`success`, `warning`, `info`) used by the
 * priority and status mappers alongside the base neutral variants.
 */
export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'destructive'
  | 'success'
  | 'warning'
  | 'info';

/**
 * Every {@link Priority} value in ascending order (lowest → highest).
 *
 * Exposed as a `readonly` tuple so generators, showcases, and mapper tests
 * can iterate the domain without duplicating the literal union. The
 * `satisfies` clause keeps the tuple in lock-step with the `Priority` type:
 * adding or removing a literal from `Priority` without updating this tuple
 * (or vice versa) produces a compile-time error.
 */
export const ALL_PRIORITIES = [
  'low',
  'medium',
  'high',
  'urgent',
] as const satisfies readonly Priority[];

/**
 * Every {@link Status} value in lifecycle order.
 *
 * Exposed as a `readonly` tuple so generators, showcases, and mapper tests
 * can iterate the domain without duplicating the literal union. The
 * `satisfies` clause keeps the tuple aligned with the `Status` type.
 */
export const ALL_STATUSES = [
  'backlog',
  'todo',
  'in_progress',
  'in_review',
  'done',
  'archived',
] as const satisfies readonly Status[];
