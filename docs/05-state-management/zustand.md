# State Management — Zustand (Client State)

## What Is It?

**Zustand** is a lightweight state management library for React. It provides global state that can be accessed from any component without prop drilling or complex provider hierarchies.

## Why Does It Matter?

- **Simple API** — Create a store in 5 lines, use it anywhere
- **No boilerplate** — Unlike Redux, no actions, reducers, or dispatch
- **TypeScript-friendly** — Full type inference out of the box
- **Lightweight** — ~1KB bundle size
- **No providers** — Works without wrapping your app in context providers

## When to Use Zustand vs. React Query

| Use Zustand For | Use React Query For |
|---|---|
| Theme preference (light/dark) | Task list from API |
| Sidebar open/closed state | User profile data |
| Active modal/dialog | Project details |
| Notification preferences | Notification list |
| Draft task content (unsaved) | Saved task data |

## How Does It Fit into DevFlow?

### UI Store

```typescript
// stores/ui-store.ts
import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  activeModal: string | null;
  theme: "light" | "dark" | "system";

  toggleSidebar: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeModal: null,
  theme: "system",

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
  setTheme: (theme) => set({ theme }),
}));
```

### Auth Store

```typescript
// stores/auth-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  currentOrg: Organization | null;

  setUser: (user: User | null) => void;
  setCurrentOrg: (org: Organization) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      currentOrg: null,

      setUser: (user) => set({ user }),
      setCurrentOrg: (org) => set({ currentOrg: org }),
      logout: () => set({ user: null, currentOrg: null }),
    }),
    { name: "auth-storage" } // Persists to localStorage
  )
);
```

### Using in Components

```tsx
function Sidebar() {
  // Subscribe to only what you need — avoids unnecessary re-renders
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <aside className={cn("w-64 border-r", !sidebarOpen && "hidden")}>
      {/* sidebar content */}
    </aside>
  );
}
```

## Common Mistakes

1. **Storing server data in Zustand** — Use React Query for API data
2. **Subscribing to the entire store** — Select only what you need
3. **Complex nested state** — Keep store state flat and simple
4. **Not using middleware** — `persist` for localStorage, `devtools` for debugging

## What I Should Be Able to Do Afterward

- [ ] Create Zustand stores with TypeScript types
- [ ] Use selectors to subscribe to specific state slices
- [ ] Persist state to localStorage with the persist middleware
- [ ] Combine Zustand with React Query for complete state management
- [ ] Debug stores with Zustand devtools
