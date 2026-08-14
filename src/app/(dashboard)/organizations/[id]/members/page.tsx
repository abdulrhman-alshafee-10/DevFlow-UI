'use client';

import { use, useState } from 'react';
import { UserPlus } from 'lucide-react';

import { useOrgMembers } from '@/hooks/use-organizations';
import { useAuth } from '@/hooks/use-auth';
import type { OrgMember } from '@/lib/api/organizations';
import { Button } from '@/components/ui/button';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { Pagination } from '@/components/ui/pagination';
import { PermissionGate } from '@/components/auth/permission-gate';
import { InviteMemberModal } from '@/components/organizations/invite-member-modal';
import { MemberInfo, RoleBadge } from '@/components/organizations/member-cell';
import { MemberActionsMenu } from '@/components/organizations/member-actions-menu';

const PAGE_SIZE = 20;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrgMembersPage({ params }: PageProps) {
  const { id: orgId } = use(params);
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [inviteOpen, setInviteOpen] = useState(false);

  const {
    members,
    total,
    isLoading,
    error,
    changeMemberRole,
    isChangingRole,
    removeMember,
    isRemoving,
  } = useOrgMembers(orgId, { page, pageSize: PAGE_SIZE });

  const columns: DataTableColumn<OrgMember>[] = [
    {
      key: 'member',
      header: 'Member',
      className: 'w-1/2',
      cell: (row) => <MemberInfo member={row} currentUserId={user?.id} />,
    },
    {
      key: 'role',
      header: 'Role',
      className: 'w-32',
      cell: (row) => <RoleBadge role={row.role} />,
    },
    {
      key: 'joined',
      header: 'Joined',
      className: 'w-32 hidden sm:table-cell',
      cell: (row) =>
        new Date(row.joinedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12 text-right',
      cell: (row) => (
        <MemberActionsMenu
          member={row}
          currentUserId={user?.id}
          onChangeRole={(memberId, payload) =>
            changeMemberRole({ memberId, payload })
          }
          onRemove={removeMember}
          isChangingRole={isChangingRole}
          isRemoving={isRemoving}
        />
      ),
    },
  ];

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Members</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {total > 0
              ? `${total} member${total !== 1 ? 's' : ''} in this organization`
              : 'Manage who has access to this organization'}
          </p>
        </div>

        <PermissionGate permission="org:invite">
          <Button onClick={() => setInviteOpen(true)}>
            <UserPlus className="size-4" aria-hidden="true" />
            Invite member
          </Button>
        </PermissionGate>
      </div>

      {/* Error banner */}
      {error && !isLoading && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Failed to load members — {error.message}
        </div>
      )}

      <DataTable
        columns={columns}
        data={members}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        emptyMessage="No members found. Invite someone to get started."
      />

      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        onPageChange={setPage}
      />

      <InviteMemberModal
        orgId={orgId}
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
      />
    </div>
  );
}
