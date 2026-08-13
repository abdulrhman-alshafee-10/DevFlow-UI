import type { Timestamps } from './index';

/** Current lifecycle state of a project. */
export type ProjectStatus = 'active' | 'archived' | 'completed';

/**
 * DevFlow project, mirroring the FastAPI `ProjectRead` schema.
 */
export interface Project extends Timestamps {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  /** ISO-8601 deadline date string, or `null` if not set. */
  dueDate: string | null;
  memberCount: number;
  taskCount: number;
}
