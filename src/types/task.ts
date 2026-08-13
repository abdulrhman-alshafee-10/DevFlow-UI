import type { Timestamps, Priority, Status } from './index';

/**
 * DevFlow task, mirroring the FastAPI `TaskRead` schema.
 *
 * `Priority` and `Status` are re-used from the shared `index.ts` since they
 * already exist and are used by the Badge system.
 */
export interface Task extends Timestamps {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  /** ID of the user this task is assigned to, or `null` if unassigned. */
  assigneeId: string | null;
  /** ISO-8601 due date string, or `null` if not set. */
  dueDate: string | null;
  /** Ordered position within its status column (used for drag-and-drop). */
  position: number;
}
