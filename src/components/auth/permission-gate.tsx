'use client';

import { useMemo, type ReactNode } from 'react';

import { useAuthStore } from '@/stores/auth-store';
import { checkPermission, hasMinRole } from '@/lib/utils/roles';
import type { UserRole } from '@/types';

interface PermissionGateProps {
  /**
   * Permission string to check (e.g. `"task:create"`, `"org:manage"`).
   * Use this OR `minRole`, not both.
   */
  permission?: string;
  /**
   * Minimum role required (e.g. `"admin"`).
   * Use this OR `permission`, not both.
   */
  minRole?: UserRole;
  /** Content shown when the check passes. */
  children: ReactNode;
  /**
   * Content shown when the check fails.
   * Defaults to `null` (renders nothing).
   */
  fallback?: ReactNode;
}

/**
 * Conditionally renders `children` based on the current user's role.
 *
 * @example — Permission-based
 * ```tsx
 * <PermissionGate permission="task:create">
 *   <Button>Create Task</Button>
 * </PermissionGate>
 * ```
 *
 * @example — Minimum-role-based with fallback
 * ```tsx
 * <PermissionGate minRole="admin" fallback={<Badge>View Only</Badge>}>
 *   <Button>Manage Members</Button>
 * </PermissionGate>
 * ```
 */
export function PermissionGate({
  permission,
  minRole,
  children,
  fallback = null,
}: PermissionGateProps) {
  const user = useAuthStore((s) => s.user);

  const granted = useMemo(() => {
    if (!user) return false;
    if (permission) return checkPermission(user.role, permission);
    if (minRole) return hasMinRole(user.role, minRole);
    // Neither prop supplied — default open (warn in dev)
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[PermissionGate] No `permission` or `minRole` prop provided — rendering children.',
      );
    }
    return true;
  }, [user, permission, minRole]);

  return granted ? <>{children}</> : <>{fallback}</>;
}
