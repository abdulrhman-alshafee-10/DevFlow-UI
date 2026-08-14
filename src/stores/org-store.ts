import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Organization } from '@/types';

/**
 * Organization context store.
 *
 * Tracks the user's full list of organizations and which one is currently
 * active (the "workspace" all project/task queries are scoped to).
 *
 * Persisted to localStorage so the active org survives a page refresh.
 */
interface OrgState {
  /** All orgs the current user belongs to. */
  organizations: Organization[];
  /** The currently selected organization, or `null` before loaded. */
  activeOrg: Organization | null;
}

interface OrgActions {
  setOrganizations: (orgs: Organization[]) => void;
  setActiveOrg: (org: Organization | null) => void;
  /** Add or update a single org in the list (upsert by id). */
  upsertOrg: (org: Organization) => void;
  /** Remove an org from the list and clear active if it was the active one. */
  removeOrg: (orgId: string) => void;
  clearOrgs: () => void;
}

export const useOrgStore = create<OrgState & OrgActions>()(
  persist(
    (set, get) => ({
      // ── Initial state ────────────────────────────────────────────────────
      organizations: [],
      activeOrg: null,

      // ── Actions ──────────────────────────────────────────────────────────
      setOrganizations: (organizations) =>
        set((s) => ({
          organizations,
          // Auto-select the first org if there's no current active one
          activeOrg:
            s.activeOrg ?? (organizations.length > 0 ? organizations[0] : null),
        })),

      setActiveOrg: (activeOrg) => set({ activeOrg }),

      upsertOrg: (org) =>
        set((s) => {
          const exists = s.organizations.some((o) => o.id === org.id);
          const organizations = exists
            ? s.organizations.map((o) => (o.id === org.id ? org : o))
            : [...s.organizations, org];
          const activeOrg = s.activeOrg?.id === org.id ? org : s.activeOrg;
          return { organizations, activeOrg };
        }),

      removeOrg: (orgId) =>
        set((s) => {
          const organizations = s.organizations.filter((o) => o.id !== orgId);
          const activeOrg =
            s.activeOrg?.id === orgId
              ? (organizations[0] ?? null)
              : s.activeOrg;
          return { organizations, activeOrg };
        }),

      clearOrgs: () => set({ organizations: [], activeOrg: null }),
    }),
    {
      name: 'devflow-active-org',
      // Only persist the active org ID — refetch full list on mount
      partialize: (s) => ({ activeOrg: s.activeOrg }),
    },
  ),
);

/** Selector: returns just the active org id, or undefined. */
export const selectActiveOrgId = (s: OrgState) => s.activeOrg?.id;
