import { apiClient } from './client';
import type { Project, ProjectStatus } from '@/types';
import type { PaginatedResponse } from '@/types';

// ── Request shapes ─────────────────────────────────────────────────────────

export interface CreateProjectPayload {
  name: string;
  description?: string;
  dueDate?: string | null;
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string | null;
  status?: ProjectStatus;
  dueDate?: string | null;
}

export interface ListProjectsParams {
  page?: number;
  pageSize?: number;
  status?: ProjectStatus;
}

// ── API functions ──────────────────────────────────────────────────────────

/** List projects for an organization, optionally filtered by status. */
export async function listProjects(
  orgId: string,
  params: ListProjectsParams = {},
): Promise<PaginatedResponse<Project>> {
  const res = await apiClient.get<PaginatedResponse<Project>>(
    `/api/v1/organizations/${orgId}/projects`,
    {
      params: {
        page: params.page ?? 1,
        page_size: params.pageSize ?? 50,
        ...(params.status ? { status: params.status } : {}),
      },
    },
  );
  return res.data;
}

/** Create a new project within an organization. */
export async function createProject(
  orgId: string,
  payload: CreateProjectPayload,
): Promise<Project> {
  const res = await apiClient.post<Project>(
    `/api/v1/organizations/${orgId}/projects`,
    payload,
  );
  return res.data;
}

/** Fetch a single project by its ID. */
export async function getProject(projectId: string): Promise<Project> {
  const res = await apiClient.get<Project>(`/api/v1/projects/${projectId}`);
  return res.data;
}

/** Update a project's fields. */
export async function updateProject(
  projectId: string,
  payload: UpdateProjectPayload,
): Promise<Project> {
  const res = await apiClient.patch<Project>(
    `/api/v1/projects/${projectId}`,
    payload,
  );
  return res.data;
}

/** Permanently delete a project. */
export async function deleteProject(projectId: string): Promise<void> {
  await apiClient.delete(`/api/v1/projects/${projectId}`);
}
