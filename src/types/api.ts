/**
 * API response envelope types.
 *
 * These mirror the FastAPI backend's standard response shapes so every
 * caller gets a fully-typed, predictable contract.
 */

/**
 * Standard error shape returned by the DevFlow API (and normalised by the
 * Axios response interceptor for network-level failures).
 */
export interface ApiErrorResponse {
  /** Human-readable error message or FastAPI `detail` string. */
  message: string;
  /** HTTP status code, or `null` for network / timeout errors. */
  status: number | null;
  /**
   * Field-level validation errors from FastAPI's 422 responses.
   * Each key is a dot-separated field path; value is the error message.
   */
  errors: Record<string, string> | null;
}

/**
 * Generic paginated list envelope.
 *
 * Replaces the earlier `Paginated<T>` in `index.ts`; that alias is kept
 * for backwards compatibility but re-exported from here going forward.
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
