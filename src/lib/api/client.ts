import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

/**
 * Centralized Axios instance for all DevFlow API requests.
 *
 * - Base URL pulled from `NEXT_PUBLIC_API_URL`
 * - `withCredentials: true` — HTTP-only auth cookies sent automatically
 * - JSON content-type by default
 *
 * Interceptors:
 * - Response success: pass through
 * - Response error: normalise into `ApiErrorResponse` shape;
 *   on 401, attempt a single token refresh then retry the original request;
 *   on refresh failure, clear auth state and redirect to /login
 */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ── Token refresh state ────────────────────────────────────────────────────

/**
 * Guards against multiple concurrent 401 responses all triggering a refresh
 * simultaneously. When a refresh is already in-flight, subsequent 401s queue
 * behind this promise and share the same result.
 */
let refreshPromise: Promise<void> | null = null;

/**
 * Separate minimal axios instance used exclusively for the refresh call.
 * Avoids going through the interceptor-decorated `apiClient` (which would
 * cause infinite loops on refresh failure).
 */
const refreshClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ── Internal types ─────────────────────────────────────────────────────────

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ── Response interceptor ───────────────────────────────────────────────────

apiClient.interceptors.response.use(
  // ✓ Success — pass through
  (response) => response,

  // ✗ Error — normalise + attempt token refresh on 401
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;

    // ── 401 handling with single refresh attempt ─────────────────────────
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Coalesce parallel 401s into a single refresh call
        if (!refreshPromise) {
          refreshPromise = refreshClient
            .post('/api/v1/auth/refresh')
            .then(() => undefined)
            .finally(() => {
              refreshPromise = null;
            });
        }

        await refreshPromise;

        // Retry the original request — new access cookie is now set
        return apiClient(originalRequest);
      } catch {
        // Refresh failed — session is dead
        refreshPromise = null;

        // Clear Zustand auth state (lazy import avoids circular dependency)
        if (typeof window !== 'undefined') {
          const { useAuthStore } = await import('@/stores/auth-store');
          useAuthStore.getState().clearAuth();

          // Capture the current path so login can redirect back
          const callbackUrl = encodeURIComponent(window.location.pathname);
          window.location.href = `/login?callbackUrl=${callbackUrl}`;
        }

        return Promise.reject(normaliseError(error));
      }
    }

    // ── All other errors ─────────────────────────────────────────────────
    return Promise.reject(normaliseError(error));
  },
);

// ── Helper ────────────────────────────────────────────────────────────────

function normaliseError(error: AxiosError) {
  if (error.response) {
    const data = error.response.data as Record<string, unknown>;
    return {
      message:
        typeof data['detail'] === 'string'
          ? data['detail']
          : (error.message ?? 'An unexpected error occurred'),
      status: error.response.status,
      errors: (data['errors'] as Record<string, string>) ?? null,
    };
  }
  return {
    message: error instanceof Error ? error.message : 'Network error',
    status: null,
    errors: null,
  };
}
