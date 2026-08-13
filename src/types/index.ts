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
