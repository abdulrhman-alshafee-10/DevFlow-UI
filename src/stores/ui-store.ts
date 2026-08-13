import { create } from 'zustand';

/**
 * UI state store.
 *
 * Owns purely presentational state that doesn't belong to any single
 * component — sidebar collapse, mobile nav open, command palette, etc.
 * No async logic lives here; it's synchronous UI toggles only.
 */
interface UiState {
  /** Whether the desktop sidebar is collapsed to icon-only mode. */
  sidebarCollapsed: boolean;
  /** Whether the mobile navigation drawer is open. */
  mobileNavOpen: boolean;
  /** Whether the global command palette (⌘K) is open. */
  commandPaletteOpen: boolean;
}

interface UiActions {
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState & UiActions>((set) => ({
  // ── Initial state ──────────────────────────────────────────────────────
  sidebarCollapsed: false,
  mobileNavOpen: false,
  commandPaletteOpen: false,

  // ── Actions ────────────────────────────────────────────────────────────
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),

  toggleCommandPalette: () =>
    set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),

  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}));
