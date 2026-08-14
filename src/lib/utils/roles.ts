import type { UserRole } from '@/types';

/**
 * Role hierarchy from lowest to highest privilege.
 * Used to determine if a role satisfies a minimum requirement.
 */
const ROLE_RANK: Record<UserRole, number> = {
  viewer: 0,
  member: 1,
  admin: 2,
  owner: 3,
};

/**
 * Returns `true` if `userRole` is at least as privileged as `minRole`.
 *
 * @example
 * hasMinRole('admin', 'member') // true  — admin outranks member
 * hasMinRole('viewer', 'admin') // false — viewer is below admin
 */
export function hasMinRole(
  userRole: UserRole | undefined | null,
  minRole: UserRole,
): boolean {
  if (!userRole) return false;
  return ROLE_RANK[userRole] >= ROLE_RANK[minRole];
}

/**
 * Permission strings used across DevFlow's UI.
 * Each string maps to the minimum role required to perform that action.
 */
const PERMISSION_ROLE_MAP: Record<string, UserRole> = {
  // Tasks
  'task:create': 'member',
  'task:edit': 'member',
  'task:delete': 'admin',
  'task:assign': 'member',
  // Projects
  'project:create': 'member',
  'project:edit': 'admin',
  'project:delete': 'admin',
  'project:archive': 'admin',
  // Organisation
  'org:manage': 'admin',
  'org:invite': 'admin',
  'org:remove-member': 'admin',
  'org:change-role': 'owner',
  'org:delete': 'owner',
  // Settings
  'settings:view': 'member',
  'settings:edit': 'admin',
};

/**
 * Returns `true` if the user's role grants the specified permission.
 *
 * @example
 * checkPermission('admin', 'task:delete')  // true
 * checkPermission('member', 'org:delete')  // false
 */
export function checkPermission(
  userRole: UserRole | undefined | null,
  permission: string,
): boolean {
  const required = PERMISSION_ROLE_MAP[permission];
  if (!required) {
    // Unknown permission — fail closed
    console.warn(`[checkPermission] Unknown permission: "${permission}"`);
    return false;
  }
  return hasMinRole(userRole, required);
}
