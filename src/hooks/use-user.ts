'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as usersApi from '@/lib/api/users';
import type {
  UpdateProfilePayload,
  ChangePasswordPayload,
} from '@/lib/api/users';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from '@/components/ui/toast';
import type { ApiErrorResponse } from '@/types';

/**
 * Hook for user-centric mutations: profile update, password change.
 * Dashboard metrics query is co-located here for a single import surface.
 */
export function useUser() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  // ── Dashboard metrics ────────────────────────────────────────────────────
  const dashboardQuery = useQuery({
    queryKey: ['users', 'me', 'dashboard'],
    queryFn: () => usersApi.getDashboardMetrics(),
    staleTime: 30_000, // 30 s — metrics refresh on each visit
  });

  // ── Update profile ────────────────────────────────────────────────────────
  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      usersApi.updateProfile(payload),
    onSuccess: (updatedUser) => {
      // Keep Zustand store and React Query cache in sync
      setUser(updatedUser);
      queryClient.setQueryData(['auth', 'me'], updatedUser);
      toast.success('Profile updated successfully.');
    },
    onError: (err: ApiErrorResponse) => {
      toast.error(err.message ?? 'Could not update profile. Please try again.');
    },
  });

  // ── Change password ───────────────────────────────────────────────────────
  const changePasswordMutation = useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      usersApi.changePassword(payload),
    onSuccess: () => {
      toast.success('Password changed successfully.');
    },
    onError: (err: ApiErrorResponse) => {
      toast.error(
        err.message ?? 'Could not change password. Please try again.',
      );
    },
  });

  return {
    // Dashboard
    metrics: dashboardQuery.data,
    isLoadingMetrics: dashboardQuery.isLoading,
    metricsError: dashboardQuery.error as ApiErrorResponse | null,
    refetchMetrics: dashboardQuery.refetch,
    // Profile update
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error as ApiErrorResponse | null,
    // Change password
    changePassword: changePasswordMutation.mutate,
    isChangingPassword: changePasswordMutation.isPending,
    changePasswordError:
      changePasswordMutation.error as ApiErrorResponse | null,
  };
}
