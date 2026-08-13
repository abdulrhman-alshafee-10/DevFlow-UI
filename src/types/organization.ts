import type { Timestamps } from './index';

/**
 * DevFlow organisation (workspace), mirroring the FastAPI
 * `OrganizationRead` schema.
 */
export interface Organization extends Timestamps {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  memberCount: number;
}
