import { apiClient } from './client';
import type { Task, Status, Priority } from '@/types';

// ── Request shapes ─────────────────────────────────────────────────────────

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  assigneeId?: string | null;
  dueDate?: string | null;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string | null;
  status?: Status;
  priority?: Priority;
  assigneeId?: string | null;
  dueDate?: string | null;
  position?: number;
}

export interface ListTasksParams {
  assigneeId?: string;
  priority?: Priority;
  status?: Status;
  search?: string;
}

// ── API functions ──────────────────────────────────────────────────────────

/** List all tasks for a project, with optional filters. */
export async function listTasks(
  projectId: string,
  params: ListTasksParams = {},
): Promise<Task[]> {
  const res = await apiClient.get<Task[]>(
    `/api/v1/projects/${projectId}/tasks`,
    { params },
  );
  return res.data;
}

/** Create a new task in a project. */
export async function createTask(
  projectId: string,
  payload: CreateTaskPayload,
): Promise<Task> {
  const res = await apiClient.post<Task>(
    `/api/v1/projects/${projectId}/tasks`,
    payload,
  );
  return res.data;
}

/** Get full details for a single task. */
export async function getTask(taskId: string): Promise<Task> {
  const res = await apiClient.get<Task>(`/api/v1/tasks/${taskId}`);
  return res.data;
}

/** Update a task's fields (status, position, etc.). */
export async function updateTask(
  taskId: string,
  payload: UpdateTaskPayload,
): Promise<Task> {
  const res = await apiClient.patch<Task>(`/api/v1/tasks/${taskId}`, payload);
  return res.data;
}

// ── History / audit log ────────────────────────────────────────────────────

export interface TaskHistoryEntry {
  id: string;
  taskId: string;
  userId: string;
  userDisplayName: string;
  userAvatarUrl: string | null;
  /** The field that changed, e.g. `"status"`, `"priority"`, `"title"`. */
  field: string;
  oldValue: string | null;
  newValue: string | null;
  createdAt: string;
}

/** Fetch the audit/history log for a task. */
export async function getTaskHistory(
  taskId: string,
): Promise<TaskHistoryEntry[]> {
  const res = await apiClient.get<TaskHistoryEntry[]>(
    `/api/v1/tasks/${taskId}/history`,
  );
  return res.data;
}
