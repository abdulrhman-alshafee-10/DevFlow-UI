# Next.js — App Router

## What Is It?

The **App Router** is Next.js's modern routing system introduced in Next.js 13. It uses the `app/` directory and provides built-in support for layouts, loading states, error handling, and Server Components.

## Why Does It Matter?

- **Nested layouts** — Layouts persist across route changes, avoiding full re-renders
- **Server Components** — Render components on the server, reducing client-side JavaScript
- **Streaming** — Send HTML progressively, showing content as it's ready
- **Loading/Error states** — Built-in per-route loading and error UI
- **Parallel routes** — Render multiple pages simultaneously
- **Intercepting routes** — Show modals while keeping URL context

## How Does It Work?

Routes are defined by the **file system**. Every `page.tsx` file becomes a route:

```
app/
├── page.tsx                    → /
├── about/page.tsx              → /about
├── projects/
│   ├── page.tsx                → /projects
│   └── [projectId]/
│       ├── page.tsx            → /projects/:projectId
│       └── settings/page.tsx   → /projects/:projectId/settings
```

### Special Files

| File | Purpose |
|---|---|
| `page.tsx` | The page component (required for a route to be accessible) |
| `layout.tsx` | Shared layout that wraps page and child layouts |
| `loading.tsx` | Loading UI shown while the page is loading |
| `error.tsx` | Error boundary for the route |
| `not-found.tsx` | 404 UI for the route |
| `template.tsx` | Like layout, but re-mounts on every navigation |

## How Does It Fit into DevFlow?

```
app/
├── (auth)/                     # Route group: no URL prefix
│   ├── layout.tsx              # Centered card layout
│   ├── login/page.tsx          # /login
│   └── register/page.tsx       # /register
│
├── (dashboard)/                # Route group: no URL prefix
│   ├── layout.tsx              # Sidebar + topbar layout
│   ├── dashboard/page.tsx      # /dashboard
│   ├── projects/
│   │   ├── page.tsx            # /projects
│   │   └── [projectId]/
│   │       ├── page.tsx        # /projects/:projectId (board)
│   │       └── tasks/
│   │           └── [taskId]/
│   │               └── page.tsx # /projects/:projectId/tasks/:taskId
│   └── settings/page.tsx       # /settings
```

## Common Mistakes

1. **Everything as Client Component** — Default to Server Components, add `"use client"` only when needed
2. **Fetching in useEffect** — Fetch data in Server Components or with React Query
3. **Not using layouts** — Duplicating shared UI instead of using layout.tsx
4. **Ignoring loading/error states** — Not providing loading.tsx and error.tsx files
5. **Putting logic in page.tsx** — Pages should delegate to feature components

## What I Should Be Able to Do Afterward

- [ ] Create routes with the file-based routing system
- [ ] Use dynamic route segments (`[id]`)
- [ ] Create nested layouts that persist across navigations
- [ ] Implement loading and error states per route
- [ ] Use route groups to organize routes without affecting URLs
- [ ] Understand when to use `page.tsx` vs `layout.tsx` vs `template.tsx`
