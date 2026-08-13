'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as authApi from '@/lib/api/auth';
import type {
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from '@/lib/api/auth';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from '@/components/ui/toast';
import type { ApiErrorResponse } from '@/types';

/**
 * Central auth hook.
 *
 * Exposes mutations for every auth action plus the reactive Zustand state.
 * All success/error toasts and store updates are co-located here so
 * individual form components stay thin.
 */
export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoading, isAuthenticated, setUser, clearAuth } =
    useAuthStore();

  // ── Session restore (/auth/me on mount) ──────────────────────────────────
  useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const me = await authApi.getMe();
      setUser(me);
      return me;
    },
    // Only fetch once — mutations keep the store current after that
    staleTime: Infinity,
    retry: false,
    // Suppress errors: a 401 just means the user is logged out
    throwOnError: false,
  });

  // ── Login ────────────────────────────────────────────────────────────────
  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(['auth', 'me'], user);
      router.push('/dashboard');
    },
    onError: (err: ApiErrorResponse) => {
      toast.error(err.message ?? 'Login failed. Please try again.');
    },
  });

  // ── Register ─────────────────────────────────────────────────────────────
  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: () => {
      router.push('/verify-email');
    },
    onError: (err: ApiErrorResponse) => {
      toast.error(err.message ?? 'Registration failed. Please try again.');
    },
  });

  // ── Logout ───────────────────────────────────────────────────────────────
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      router.push('/login');
    },
    onError: () => {
      // Still clear local state even if the server call fails
      clearAuth();
      queryClient.clear();
      router.push('/login');
    },
  });

  // ── Logout all ───────────────────────────────────────────────────────────
  const logoutAllMutation = useMutation({
    mutationFn: () => authApi.logoutAll(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success('Signed out from all devices.');
      router.push('/login');
    },
    onError: (err: ApiErrorResponse) => {
      toast.error(err.message ?? 'Failed to sign out from all devices.');
    },
  });

  // ── Forgot password ───────────────────────────────────────────────────────
  const forgotPasswordMutation = useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      authApi.forgotPassword(payload),
    onSuccess: () => {
      toast.success('Reset link sent — check your inbox.');
    },
    onError: (err: ApiErrorResponse) => {
      toast.error(err.message ?? 'Could not send reset email.');
    },
  });

  // ── Reset password ────────────────────────────────────────────────────────
  const resetPasswordMutation = useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      authApi.resetPassword(payload),
    onSuccess: () => {
      toast.success('Password updated. You can now sign in.');
      router.push('/login');
    },
    onError: (err: ApiErrorResponse) => {
      toast.error(
        err.message ?? 'Could not reset password. The link may have expired.',
      );
    },
  });

  // ── Verify email ──────────────────────────────────────────────────────────
  const verifyEmailMutation = useMutation({
    mutationFn: (payload: VerifyEmailPayload) => authApi.verifyEmail(payload),
    onSuccess: () => {
      toast.success('Email verified! You can now sign in.');
      router.push('/login');
    },
    onError: (err: ApiErrorResponse) => {
      toast.error(
        err.message ?? 'Verification failed. The link may have expired.',
      );
    },
  });

  return {
    // State
    user,
    isLoading,
    isAuthenticated,
    // Actions
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    logoutAll: logoutAllMutation.mutate,
    isLoggingOutAll: logoutAllMutation.isPending,
    forgotPassword: forgotPasswordMutation.mutate,
    isSendingReset: forgotPasswordMutation.isPending,
    forgotPasswordSuccess: forgotPasswordMutation.isSuccess,
    resetPassword: resetPasswordMutation.mutate,
    isResettingPassword: resetPasswordMutation.isPending,
    verifyEmail: verifyEmailMutation.mutate,
    isVerifyingEmail: verifyEmailMutation.isPending,
    verifyEmailError: verifyEmailMutation.error as ApiErrorResponse | null,
  };
}
