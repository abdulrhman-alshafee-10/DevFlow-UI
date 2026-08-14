import { apiClient } from './client';

// ── Result shapes ──────────────────────────────────────────────────────────

export interface TaskResult {
  type: 'task';
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  status: string;
  priority: string;
  url: string;
}

export interface ProjectResult {
  type: 'project';
  id: string;
  name: string;
  orgId: string;
  orgName: string;
  url: string;
}

export interface UserResult {
  type: 'user';
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
}

export type SearchResult = TaskResult | ProjectResult | UserResult;

export interface SearchResponse {
  tasks: TaskResult[];
  projects: ProjectResult[];
  users: UserResult[];
}

// ── API function ───────────────────────────────────────────────────────────

/** Run a global search across tasks, projects, and users. */
export async function search(query: string): Promise<SearchResponse> {
  const res = await apiClient.get<SearchResponse>('/api/v1/search', {
    params: { q: query },
  });
  return res.data;
}
