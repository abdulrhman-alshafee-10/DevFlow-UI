# Phase 3 — Next.js App Router & Layouts

## Objective

Establish the core routing structure of the application using the Next.js App Router. Create the layouts for the authentication pages and the main dashboard application.

---

## Concepts Learned

- File-based routing in Next.js
- Route groups (`(groupName)`)
- Nested layouts (`layout.tsx`)
- Loading UI and Error Boundaries
- Active link styling based on current route
- Metadata API for SEO

**Relevant docs**:
- `03-nextjs/app-router.md`
- `03-nextjs/server-client-components.md`

---

## Features After This Phase

- [ ] Authentication layout (centered card)
- [ ] Dashboard layout (sidebar and top navigation)
- [ ] Mobile responsive navigation menu
- [ ] Placeholder pages for all main routes
- [ ] Loading skeletons for transitions
- [ ] Custom 404 Not Found page

---

## Routing Structure

We will create the following route groups and pages:

### `(auth)` group
- `/login`
- `/register`
- `/verify-email`
- `/reset-password`

### `(dashboard)` group
- `/dashboard`
- `/projects`
- `/tasks`
- `/settings`

---

## Component Requirements

### 1. `Sidebar`
- List of navigation links
- Active state highlighting based on `usePathname()`
- Collapsible on mobile, fixed on desktop

### 2. `Topbar`
- Breadcrumbs indicating current location
- User profile dropdown menu (using the component from Phase 2)
- Mobile menu toggle button

### 3. `MobileNav`
- Slide-out drawer or full-screen menu for mobile navigation

---

## Completion Checklist

- [ ] Create the `(auth)` and `(dashboard)` route groups
- [ ] Create `layout.tsx` for the auth group
- [ ] Create `layout.tsx` for the dashboard group
- [ ] Implement the `Sidebar` component with active link detection
- [ ] Implement the `Topbar` with breadcrumbs and profile dropdown
- [ ] Implement mobile navigation toggle
- [ ] Create placeholder `page.tsx` files for all routes
- [ ] Add `loading.tsx` with skeleton loaders for the dashboard
- [ ] Add a custom `not-found.tsx` page
- [ ] Set up default Metadata in the root layout
