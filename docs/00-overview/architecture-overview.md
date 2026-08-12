# Architecture Overview

## Frontend Architecture

DevFlow's frontend follows a **layered component architecture** that separates concerns into distinct layers, each with a clear responsibility.

```
┌─────────────────────────────────────────────────────────────┐
│                        USER (Browser)                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                   NEXT.JS APPLICATION                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Page Layer (App Router)                              │   │
│  │  /login  /dashboard  /projects  /tasks  /settings     │   │
│  └──────────────────────┬───────────────────────────────┘   │
│  ┌──────────────────────▼───────────────────────────────┐   │
│  │  Layout Layer                                         │   │
│  │  RootLayout → AuthLayout → DashboardLayout            │   │
│  └──────────────────────┬───────────────────────────────┘   │
│  ┌──────────────────────▼───────────────────────────────┐   │
│  │  Feature Components Layer                             │   │
│  │  TaskBoard, TaskCard, ProjectList, CommentThread      │   │
│  └──────────────────────┬───────────────────────────────┘   │
│  ┌──────────────────────▼───────────────────────────────┐   │
│  │  UI Components Layer (Design System)                  │   │
│  │  Button, Input, Modal, Dropdown, Avatar, Badge        │   │
│  └──────────────────────┬───────────────────────────────┘   │
│  ┌──────────────────────▼───────────────────────────────┐   │
│  │  Hooks Layer (Custom Hooks)                           │   │
│  │  useAuth, useTasks, useWebSocket, useDebounce         │   │
│  └──────────────────────┬───────────────────────────────┘   │
│  ┌──────────────────────▼───────────────────────────────┐   │
│  │  State Layer                                          │   │
│  │  React Query (server) + Zustand (client) + URL state  │   │
│  └──────────────────────┬───────────────────────────────┘   │
│  ┌──────────────────────▼───────────────────────────────┐   │
│  │  API Client Layer                                     │   │
│  │  Axios instance, interceptors, type-safe endpoints    │   │
│  └──────────────────────┬───────────────────────────────┘   │
│  ┌──────────────────────▼───────────────────────────────┐   │
│  │  Next.js API Routes (BFF Layer)                       │   │
│  │  Token management, proxy, server-side calls           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────┬───────────────────────────────┬───────────────────┘
          │ HTTPS                         │ WS/SSE
          ▼                               ▼
┌──────────────────────────────────────────────────────────────┐
│              FASTAPI BACKEND (Already Built)                  │
│   REST API    │    WebSockets    │    SSE    │    Files       │
└──────────────────────────────────────────────────────────────┘
```

---

## Application Layers Explained

### 1. Page Layer (Routes)

**Responsibility**: Define the application's URL structure and render page-level content.

- Each route maps to a file in the `app/` directory
- Uses Server Components by default for performance
- Fetches initial data on the server when possible
- Handles metadata (title, description) per page
- Contains minimal logic — delegates to feature components

### 2. Layout Layer

**Responsibility**: Provide shared UI structure across related pages.

- Root layout: HTML shell, global providers, fonts
- Auth layout: centered card for login/register pages
- Dashboard layout: sidebar, top nav, main content area
- Nested layouts persist across route changes (no re-render)

### 3. Feature Components Layer

**Responsibility**: Implement specific business features as self-contained components.

- Compose UI components into meaningful features
- Contain feature-specific logic and state
- Connect to hooks and state management
- Examples: `TaskBoard`, `ProjectSettings`, `MemberInviteForm`

### 4. UI Components Layer (Design System)

**Responsibility**: Provide reusable, styled, accessible building blocks.

- Generic, reusable components with no business logic
- Fully accessible (keyboard, screen reader, ARIA)
- Consistent styling via Tailwind + design tokens
- Examples: `Button`, `Input`, `Modal`, `DataTable`, `Badge`

### 5. Hooks Layer

**Responsibility**: Encapsulate reusable logic separate from UI.

- Custom hooks for data fetching (`useTasks`, `useProjects`)
- Custom hooks for UI logic (`useDebounce`, `useMediaQuery`)
- Custom hooks for integrations (`useWebSocket`, `useAuth`)
- Keep components clean by extracting complex logic

### 6. State Layer

**Responsibility**: Manage application data and UI state.

| State Type | Solution | When to Use |
|---|---|---|
| Server state | React Query | Data from the API (tasks, users, projects) |
| Client state | Zustand | UI state not tied to URL (theme, sidebar, modals) |
| Form state | React Hook Form | Input values, validation, submission |
| URL state | searchParams | Filters, pagination, search (bookmarkable) |

### 7. API Client Layer

**Responsibility**: Communicate with the backend in a type-safe manner.

- Centralized Axios instance with base URL and interceptors
- Automatic token attachment to requests
- Automatic token refresh on 401 responses
- Type-safe request/response with TypeScript interfaces
- Consistent error handling and transformation

---

## Data Flow Example: Creating a Task

```
User clicks "Create Task" button
    │
    ▼
TaskCreateForm: React Hook Form validates input with Zod schema
    │
    ▼
Form onSubmit: Calls useMutation from React Query
    │
    ▼
Optimistic update: Task appears immediately in the Kanban board
    │
    ▼
API Client: POST /api/v1/projects/{id}/tasks (with auth header)
    │
    ▼
FastAPI Backend: Creates task, returns TaskResponse
    │
    ▼
React Query: Updates cache with server response
    │
    ▼
WebSocket: Backend broadcasts "task_created" event
    │
    ▼
Other users: See the new task appear in real-time
```

---

## Server Components vs. Client Components

### Server Components (Default in App Router)

- Render on the server, send HTML to the client
- Can directly access databases, file systems, environment variables
- Reduce client-side JavaScript bundle
- **Use for**: Static content, data fetching, layouts, SEO-critical pages

### Client Components (`"use client"`)

- Render on both server (initial) and client (hydration)
- Can use hooks (useState, useEffect), event handlers, browser APIs
- Required for interactivity
- **Use for**: Forms, buttons, modals, any interactive UI

### The Rule of Thumb

```
                Server Component
               /                 \
         Static UI            Data Display
                                  │
                          needs interactivity?
                         /                    \
                       No                     Yes
                       │                       │
                Server Component         Client Component
```

---

## Directory Structure (Target)

```
devflow-frontend/
├── public/                         # Static assets
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
│
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Landing page
│   │   ├── not-found.tsx           # 404 page
│   │   ├── error.tsx               # Global error boundary
│   │   ├── loading.tsx             # Global loading state
│   │   │
│   │   ├── (auth)/                 # Auth route group (no layout prefix)
│   │   │   ├── layout.tsx          # Centered auth layout
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── verify-email/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   │
│   │   ├── (dashboard)/            # Dashboard route group
│   │   │   ├── layout.tsx          # Sidebar + topbar layout
│   │   │   ├── dashboard/page.tsx  # Home dashboard
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx        # Project list
│   │   │   │   └── [projectId]/
│   │   │   │       ├── page.tsx    # Project board
│   │   │   │       ├── settings/page.tsx
│   │   │   │       └── tasks/
│   │   │   │           └── [taskId]/page.tsx
│   │   │   ├── organizations/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [orgId]/
│   │   │   │       ├── settings/page.tsx
│   │   │   │       └── members/page.tsx
│   │   │   ├── notifications/page.tsx
│   │   │   ├── search/page.tsx
│   │   │   └── settings/page.tsx
│   │   │
│   │   └── api/                    # Next.js API routes (BFF)
│   │       └── auth/
│   │           └── [...nextauth]/route.ts
│   │
│   ├── components/                 # Shared components
│   │   ├── ui/                     # Design system primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── dropdown.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── data-table.tsx
│   │   │   └── ...
│   │   │
│   │   ├── features/               # Feature-specific components
│   │   │   ├── auth/
│   │   │   ├── tasks/
│   │   │   ├── projects/
│   │   │   ├── organizations/
│   │   │   ├── comments/
│   │   │   ├── notifications/
│   │   │   └── ai/
│   │   │
│   │   └── layout/                 # Layout components
│   │       ├── sidebar.tsx
│   │       ├── topbar.tsx
│   │       ├── breadcrumbs.tsx
│   │       └── footer.tsx
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-tasks.ts
│   │   ├── use-projects.ts
│   │   ├── use-websocket.ts
│   │   ├── use-debounce.ts
│   │   ├── use-media-query.ts
│   │   └── ...
│   │
│   ├── lib/                        # Utility libraries
│   │   ├── api/                    # API client
│   │   │   ├── client.ts           # Axios instance
│   │   │   ├── auth.ts             # Auth API calls
│   │   │   ├── tasks.ts            # Task API calls
│   │   │   ├── projects.ts         # Project API calls
│   │   │   └── ...
│   │   │
│   │   ├── validations/            # Zod schemas
│   │   │   ├── auth.ts
│   │   │   ├── task.ts
│   │   │   └── ...
│   │   │
│   │   └── utils/                  # Helper functions
│   │       ├── cn.ts               # Class name utility
│   │       ├── date.ts             # Date formatting
│   │       └── ...
│   │
│   ├── stores/                     # Zustand stores
│   │   ├── auth-store.ts
│   │   ├── ui-store.ts
│   │   └── ...
│   │
│   ├── types/                      # TypeScript type definitions
│   │   ├── api.ts                  # API response types
│   │   ├── task.ts
│   │   ├── user.ts
│   │   ├── project.ts
│   │   └── ...
│   │
│   └── styles/                     # Global styles
│       └── globals.css
│
├── tests/                          # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/                           # This documentation
├── .env.local                      # Environment variables
├── .env.example                    # Example environment variables
├── next.config.js                  # Next.js configuration
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json
├── Dockerfile
├── docker-compose.yml
└── .gitignore
```

---

## Key Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js 14+ (App Router) | SSR, routing, optimizations, industry standard |
| Language | TypeScript | Type safety, better DX, fewer runtime errors |
| Styling | Tailwind CSS + Radix UI | Utility-first, accessible, highly customizable |
| Server state | React Query | Caching, mutations, optimistic updates, devtools |
| Client state | Zustand | Lightweight, simple API, TypeScript-friendly |
| Forms | React Hook Form + Zod | Performance, validation, schema-driven |
| Auth | HTTP-only cookies + Middleware | Secure, XSS-resistant, SSR-compatible |
| Real-time | Native WebSocket + EventSource | No extra dependencies, standard APIs |
| Testing | Vitest + Playwright | Fast unit tests, reliable E2E tests |
| Deployment | Docker + Vercel | Flexibility for self-hosted or managed |
