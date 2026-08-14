import { apiClient } from './client';
import type { User } from '@/types';

/**
 * Auth API — all requests to `/api/v1/auth/*`.
 *
 * HTTP-only cookies are handled transparently by the browser thanks to
 * `withCredentials: true` on the Axios instance — no token juggling here.
 */

// ── Request / response shapes ──────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  displayName: string;
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface VerifyEmailPayload {
  token: string;
}

// ── API functions ──────────────────────────────────────────────────────────

/** Authenticate and receive HTTP-only session cookies. */
export async function login(payload: LoginPayload): Promise<User> {
  const res = await apiClient.post<User>('/api/v1/auth/login', payload);
  return res.data;
}

/** Create a new account. Returns the created user. */
export async function register(payload: RegisterPayload): Promise<User> {
  const res = await apiClient.post<User>('/api/v1/auth/register', payload);
  return res.data;
}

/** Fetch the currently authenticated user from the session cookie. */
export async function getMe(): Promise<User> {
  const res = await apiClient.get<User>('/api/v1/auth/me');
  return res.data;
}

/** Invalidate the current session cookie. */
export async function logout(): Promise<void> {
  await apiClient.post('/api/v1/auth/logout');
}

/** Invalidate all active sessions for this user. */
export async function logoutAll(): Promise<void> {
  await apiClient.post('/api/v1/auth/logout-all');
}

/** Send a password-reset email. */
export async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<void> {
  await apiClient.post('/api/v1/auth/forgot-password', payload);
}

/** Set a new password using the token from the reset email. */
export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<void> {
  await apiClient.post('/api/v1/auth/reset-password', payload);
}

/** Verify an email address using the token from the verification email. */
export async function verifyEmail(payload: VerifyEmailPayload): Promise<void> {
  await apiClient.post('/api/v1/auth/verify-email', payload);
}

/**
 * Attempt to refresh the access token using the HTTP-only refresh cookie.
 * Called automatically by the Axios 401 interceptor — not called directly
 * by application code.
 */
export async function refresh(): Promise<void> {
  await apiClient.post('/api/v1/auth/refresh');
}
