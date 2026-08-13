import type { Timestamps } from './index';

/** Role a user can hold within an organisation. */
export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

/**
 * DevFlow user account, mirroring the FastAPI `UserRead` schema.
 */
export interface User extends Timestamps {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
  isVerified: boolean;
}
