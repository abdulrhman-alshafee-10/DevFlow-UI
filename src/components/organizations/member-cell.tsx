import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { BadgeVariant } from '@/types';
import type { OrgMember } from '@/lib/api/organizations';

/** Role → badge variant map for member role pills. */
export const ROLE_VARIANT: Record<OrgMember['role'], BadgeVariant> = {
  owner: 'default',
  admin: 'warning',
  member: 'secondary',
  viewer: 'outline',
};

// ── MemberInfo ─────────────────────────────────────────────────────────────

interface MemberInfoProps {
  member: OrgMember;
  /** ID of the current logged-in user — renders "(you)" tag. */
  currentUserId?: string;
}

/**
 * Avatar + display name + email cell used in the members DataTable.
 */
export function MemberInfo({ member, currentUserId }: MemberInfoProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar
        src={member.avatarUrl ?? undefined}
        name={member.displayName}
        size="sm"
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">
          {member.displayName}
          {member.userId === currentUserId && (
            <span className="ml-1.5 text-xs text-muted-foreground">(you)</span>
          )}
        </p>
        <p className="truncate text-xs text-muted-foreground">{member.email}</p>
      </div>
    </div>
  );
}

// ── RoleBadge ──────────────────────────────────────────────────────────────

interface RoleBadgeProps {
  role: OrgMember['role'];
}

/** Styled badge for a member's role. */
export function RoleBadge({ role }: RoleBadgeProps) {
  return <Badge variant={ROLE_VARIANT[role]}>{role}</Badge>;
}
