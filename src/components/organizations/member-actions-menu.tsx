'use client';

import { MoreHorizontal, ShieldCheck, UserMinus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PermissionGate } from '@/components/auth/permission-gate';
import type {
  OrgMember,
  ChangeMemberRolePayload,
} from '@/lib/api/organizations';

interface MemberActionsMenuProps {
  member: OrgMember;
  currentUserId?: string;
  onChangeRole: (memberId: string, payload: ChangeMemberRolePayload) => void;
  onRemove: (memberId: string) => void;
  isChangingRole?: boolean;
  isRemoving?: boolean;
}

/**
 * Three-dot actions dropdown for a single member row.
 *
 * Returns null if the current user is looking at themselves or the org owner
 * (neither can be managed from this table).
 */
export function MemberActionsMenu({
  member,
  currentUserId,
  onChangeRole,
  onRemove,
  isChangingRole,
  isRemoving,
}: MemberActionsMenuProps) {
  // Can't act on yourself or the owner
  if (member.userId === currentUserId || member.role === 'owner') return null;

  // Narrowed: 'admin' | 'member' | 'viewer'
  const role = member.role;

  return (
    <PermissionGate permission="org:remove-member">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${member.displayName}`}
          >
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <PermissionGate permission="org:change-role">
            {role !== 'admin' && (
              <DropdownMenuItem
                onSelect={() => onChangeRole(member.id, { role: 'admin' })}
                disabled={isChangingRole}
              >
                <ShieldCheck className="size-4" aria-hidden="true" />
                Promote to Admin
              </DropdownMenuItem>
            )}
            {role === 'admin' && (
              <DropdownMenuItem
                onSelect={() => onChangeRole(member.id, { role: 'member' })}
                disabled={isChangingRole}
              >
                <ShieldCheck className="size-4" aria-hidden="true" />
                Set as Member
              </DropdownMenuItem>
            )}
            {role !== 'viewer' && (
              <DropdownMenuItem
                onSelect={() => onChangeRole(member.id, { role: 'viewer' })}
                disabled={isChangingRole}
              >
                <ShieldCheck className="size-4" aria-hidden="true" />
                Set as Viewer
              </DropdownMenuItem>
            )}
          </PermissionGate>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={() => onRemove(member.id)}
            disabled={isRemoving}
            destructive
          >
            <UserMinus className="size-4" aria-hidden="true" />
            Remove member
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </PermissionGate>
  );
}
