import { create } from 'zustand';

import type { User } from '@/types';

/**
 * Auth state store.
 *
 * Tracks the currently authenticated user and the loading state of the
 * initial session check. Auth API calls live in `src/lib/api/auth.ts`.
 * This store is the reactive state container.
 */
interface AuthState {
  /** Authenticated user, or `null` when logged out / not yet loaded. */
  user: User | null;
  /**
   * `true` while the initial `/auth/me` check is in-flight.
   * Consumers can gate route rendering on this to avoid flashes.
   */
  isLoading: boolean;
  /** Derived convenience: `true` when `user` is non-null and not loading. */
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  /** Clears user state — call after a successful logout API response. */
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  // ── Initial state ──────────────────────────────────────────────────────
  user: null,
  isLoading: true, // assume a check is pending on first mount
  isAuthenticated: false,

  // ── Actions ────────────────────────────────────────────────────────────
  setUser: (user) =>
    set({ user, isAuthenticated: user !== null, isLoading: false }),

  setLoading: (isLoading) => set({ isLoading }),

  clearAuth: () =>
    set({ user: null, isAuthenticated: false, isLoading: false }),
}));
