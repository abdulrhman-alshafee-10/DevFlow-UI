import { apiClient } from './client';
import type { User } from '@/types';

// ── Request / response shapes ──────────────────────────────────────────────

export interface DashboardMetrics {
  openTasks: number;
  activeProjects: number;
  teamMembers: number;
  completedToday: number;
  tasksDueSoon: TaskDueSoon[];
  recentProjects: RecentProject[];
}

export interface TaskDueSoon {
  id: string;
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  projectName: string;
}

export interface RecentProject {
  id: string;
  name: string;
  taskCount: number;
  status: 'active' | 'archived' | 'completed';
  updatedAt: string;
}

export interface UpdateProfilePayload {
  displayName?: string;
  avatarUrl?: string | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// ── API functions ──────────────────────────────────────────────────────────

/** Fetch aggregated dashboard metrics for the current user. */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const res = await apiClient.get<DashboardMetrics>(
    '/api/v1/users/me/dashboard',
  );
  return res.data;
}

/** Update the current user's profile fields. */
export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<User> {
  const res = await apiClient.patch<User>('/api/v1/users/me', payload);
  return res.data;
}

/** Change the current user's password. Requires the existing password. */
export async function changePassword(
  payload: ChangePasswordPayload,
): Promise<void> {
  await apiClient.post('/api/v1/auth/change-password', payload);
}
