import axios from 'axios';

/**
 * Centralized Axios instance for all DevFlow API requests.
 *
 * - Base URL pulled from `NEXT_PUBLIC_API_URL` (defaults to localhost:8000)
 * - `withCredentials: true` so HTTP-only auth cookies are sent automatically
 * - JSON content-type set by default
 *
 * Interceptors:
 * - Request: no-op placeholder (auth token injection happens via cookies)
 * - Response: unwraps the data envelope and normalises error shape into
 *   `ApiErrorResponse` so callers always get a consistent rejection
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ─── Response interceptor ──────────────────────────────────────────────── */

apiClient.interceptors.response.use(
  // Success: pass the response through untouched
  (response) => response,

  // Error: normalise into a structured rejection
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      // The backend returned a response — shape it into ApiErrorResponse
      const data = error.response.data as Record<string, unknown>;
      return Promise.reject({
        message:
          typeof data['detail'] === 'string'
            ? data['detail']
            : (error.message ?? 'An unexpected error occurred'),
        status: error.response.status,
        errors: data['errors'] ?? null,
      });
    }

    // Network error / timeout — no response object
    return Promise.reject({
      message: error instanceof Error ? error.message : 'Network error',
      status: null,
      errors: null,
    });
  },
);
