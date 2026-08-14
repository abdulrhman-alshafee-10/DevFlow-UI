'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import * as orgsApi from '@/lib/api/organizations';
import type {
  CreateOrganizationPayload,
  UpdateOrganizationPayload,
  InviteMemberPayload,
  ChangeMemberRolePayload,
  ListMembersParams,
} from '@/lib/api/organizations';
import { useOrgStore } from '@/stores/org-store';
import { toast } from '@/components/ui/toast';
import type { ApiErrorResponse } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// List + active org
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Loads all organizations the user belongs to and hydrates the org store.
 */
export function useOrganizations() {
  const { organizations, activeOrg, setOrganizations, setActiveOrg } =
    useOrgStore();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const orgs = await orgsApi.listOrganizations();
      setOrganizations(orgs);
      return orgs;
    },
    staleTime: 60_000,
  });

  // ── Create org ─────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (payload: CreateOrganizationPayload) =>
      orgsApi.createOrganization(payload),
    onSuccess: (newOrg) => {
      useOrgStore.getState().upsertOrg(newOrg);
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      setActiveOrg(newOrg);
      toast.success(`Organization "${newOrg.name}" created.`);
    },
    onError: (err: ApiErrorResponse) => {
      toast.error(err.message ?? 'Could not create organization.');
    },
  });

  return {
    organizations,
    activeOrg,
    setActiveOrg,
    isLoading: query.isLoading,
    error: query.error as ApiErrorResponse | null,
    createOrg: createMutation.mutate,
    createOrgAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error as ApiErrorResponse | null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Single org settings
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Manages a single organization — used on the settings page.
 */
export function useOrganization(orgId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const query = useQuery({
    queryKey: ['organizations', orgId],
    queryFn: () => orgsApi.getOrganization(orgId),
    enabled: Boolean(orgId),
    staleTime: 60_000,
  });

  // ── Update ─────────────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: (payload: UpdateOrganizationPayload) =>
      orgsApi.updateOrganization(orgId, payload),
    onSuccess: (updated) => {
      useOrgStore.getState().upsertOrg(updated);
      queryClient.setQueryData(['organizations', orgId], updated);
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast.success('Organization updated.');
    },
    onError: (err: ApiErrorResponse) => {
      toast.error(err.message ?? 'Could not update organization.');
    },
  });

  // ── Delete ─────────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: () => orgsApi.deleteOrganization(orgId),
    onSuccess: () => {
      useOrgStore.getState().removeOrg(orgId);
      queryClient.removeQueries({ queryKey: ['organizations', orgId] });
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast.success('Organization deleted.');
      router.push('/dashboard');
    },
    onError: (err: ApiErrorResponse) => {
      toast.error(err.message ?? 'Could not delete organization.');
    },
  });

  return {
    org: query.data,
    isLoading: query.isLoading,
    error: query.error as ApiErrorResponse | null,
    updateOrg: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error as ApiErrorResponse | null,
    deleteOrg: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Members
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches and manages members for a given organization.
 */
export function useOrgMembers(orgId: string, params: ListMembersParams = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['organizations', orgId, 'members', params],
    queryFn: () => orgsApi.listMembers(orgId, params),
    enabled: Boolean(orgId),
    staleTime: 30_000,
  });

  // ── Invite ─────────────────────────────────────────────────────────────
  const inviteMutation = useMutation({
    mutationFn: (payload: InviteMemberPayload) =>
      orgsApi.inviteMember(orgId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['organizations', orgId, 'members'],
      });
      toast.success('Invitation sent successfully.');
    },
    onError: (err: ApiErrorResponse) => {
      toast.error(err.message ?? 'Could not send invitation.');
    },
  });

  // ── Change role ────────────────────────────────────────────────────────
  const changeRoleMutation = useMutation({
    mutationFn: ({
      memberId,
      payload,
    }: {
      memberId: string;
      payload: ChangeMemberRolePayload;
    }) => orgsApi.changeMemberRole(orgId, memberId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['organizations', orgId, 'members'],
      });
      toast.success('Member role updated.');
    },
    onError: (err: ApiErrorResponse) => {
      toast.error(err.message ?? 'Could not update role.');
    },
  });

  // ── Remove ─────────────────────────────────────────────────────────────
  const removeMutation = useMutation({
    mutationFn: (memberId: string) => orgsApi.removeMember(orgId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['organizations', orgId, 'members'],
      });
      toast.success('Member removed from organization.');
    },
    onError: (err: ApiErrorResponse) => {
      toast.error(err.message ?? 'Could not remove member.');
    },
  });

  return {
    membersPage: query.data,
    members: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    error: query.error as ApiErrorResponse | null,
    // Invite
    inviteMember: inviteMutation.mutate,
    isInviting: inviteMutation.isPending,
    // Change role
    changeMemberRole: changeRoleMutation.mutate,
    isChangingRole: changeRoleMutation.isPending,
    // Remove
    removeMember: removeMutation.mutate,
    isRemoving: removeMutation.isPending,
  };
}
