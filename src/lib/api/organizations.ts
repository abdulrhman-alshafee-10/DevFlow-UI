import { apiClient } from './client';
import type { Organization } from '@/types';
import type { PaginatedResponse } from '@/types';

// ── Member types ───────────────────────────────────────────────────────────

/** Role a user holds in an organization — mirrors the backend enum. */
export type OrgMemberRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface OrgMember {
  id: string;
  userId: string;
  organizationId: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  role: OrgMemberRole;
  joinedAt: string;
}

// ── Request shapes ─────────────────────────────────────────────────────────

export interface CreateOrganizationPayload {
  name: string;
}

export interface UpdateOrganizationPayload {
  name?: string;
}

export interface InviteMemberPayload {
  email: string;
  role: OrgMemberRole;
}

export interface ChangeMemberRolePayload {
  role: OrgMemberRole;
}

export interface ListMembersParams {
  page?: number;
  pageSize?: number;
}

// ── API functions ──────────────────────────────────────────────────────────

/** List all organizations the current user belongs to. */
export async function listOrganizations(): Promise<Organization[]> {
  const res = await apiClient.get<Organization[]>('/api/v1/organizations');
  return res.data;
}

/** Create a new organization. Returns the created org. */
export async function createOrganization(
  payload: CreateOrganizationPayload,
): Promise<Organization> {
  const res = await apiClient.post<Organization>(
    '/api/v1/organizations',
    payload,
  );
  return res.data;
}

/** Fetch a single organization by ID. */
export async function getOrganization(orgId: string): Promise<Organization> {
  const res = await apiClient.get<Organization>(
    `/api/v1/organizations/${orgId}`,
  );
  return res.data;
}

/** Update an organization's details (name, etc.). */
export async function updateOrganization(
  orgId: string,
  payload: UpdateOrganizationPayload,
): Promise<Organization> {
  const res = await apiClient.patch<Organization>(
    `/api/v1/organizations/${orgId}`,
    payload,
  );
  return res.data;
}

/** Permanently delete an organization. Owner-only. */
export async function deleteOrganization(orgId: string): Promise<void> {
  await apiClient.delete(`/api/v1/organizations/${orgId}`);
}

/** List members of an organization with pagination. */
export async function listMembers(
  orgId: string,
  params: ListMembersParams = {},
): Promise<PaginatedResponse<OrgMember>> {
  const res = await apiClient.get<PaginatedResponse<OrgMember>>(
    `/api/v1/organizations/${orgId}/members`,
    { params: { page: params.page ?? 1, page_size: params.pageSize ?? 20 } },
  );
  return res.data;
}

/** Send an invitation to join the organization. */
export async function inviteMember(
  orgId: string,
  payload: InviteMemberPayload,
): Promise<void> {
  await apiClient.post(`/api/v1/organizations/${orgId}/invitations`, payload);
}

/** Change a member's role within the organization. */
export async function changeMemberRole(
  orgId: string,
  memberId: string,
  payload: ChangeMemberRolePayload,
): Promise<OrgMember> {
  const res = await apiClient.patch<OrgMember>(
    `/api/v1/organizations/${orgId}/members/${memberId}`,
    payload,
  );
  return res.data;
}

/** Remove a member from the organization. */
export async function removeMember(
  orgId: string,
  memberId: string,
): Promise<void> {
  await apiClient.delete(`/api/v1/organizations/${orgId}/members/${memberId}`);
}
