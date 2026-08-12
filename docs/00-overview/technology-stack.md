# Technology Stack

## Core Framework

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 20+ LTS | Runtime environment — JavaScript/TypeScript execution |
| **Next.js** | 14+ (App Router) | React framework — SSR, routing, API routes, optimizations |
| **React** | 18+ | UI library — components, hooks, concurrent features |
| **TypeScript** | 5+ | Type safety — compile-time error checking, better DX |

### Why Next.js?

- **Performance** — Server-side rendering, static generation, streaming
- **Routing** — File-based routing with layouts, loading states, error boundaries
- **Full-stack** — API routes for backend-for-frontend patterns
- **Optimizations** — Automatic code splitting, image optimization, font optimization
- **Developer experience** — Fast Refresh, excellent error overlay, TypeScript support
- **Industry standard** — Used by Vercel, Netflix, TikTok, Twitch, and more

---

## Styling

| Technology | Purpose |
|---|---|
| **Tailwind CSS 3.x** | Utility-first CSS framework — rapid prototyping, consistent design |
| **CSS Modules** | Scoped styles — component-level CSS without conflicts |
| **clsx / tailwind-merge** | Dynamic class composition — conditional and merged class names |

### Why Tailwind CSS?

- Rapid development with utility classes
- Design system constraints built in (spacing, colors, typography)
- Excellent dark mode support
- Smaller production CSS (purges unused styles)
- Works seamlessly with Next.js

---

## UI Components

| Technology | Purpose |
|---|---|
| **Radix UI** | Headless, accessible primitives — dialogs, dropdowns, tooltips, etc. |
| **Lucide React** | Icon library — clean, consistent SVG icons |
| **Framer Motion** | Animation library — layout animations, gestures, page transitions |

### Why Radix UI?

- Fully accessible (WAI-ARIA compliant) out of the box
- Unstyled — works with any design system
- Composable — pick only the components you need
- No vendor lock-in — just accessible primitives
- Works perfectly with Tailwind CSS

---

## State Management

| Technology | Purpose |
|---|---|
| **React Query (TanStack Query)** | Server state management — caching, refetching, optimistic updates |
| **Zustand** | Client state management — lightweight, simple global state |
| **React Hook Form** | Form state management — validation, performance, DX |
| **Zod** | Schema validation — runtime type checking, form validation |

### Why This Combination?

| State Type | Solution | Examples |
|---|---|---|
| Server state | React Query | API data (tasks, users, projects) |
| Client state | Zustand | Theme, sidebar open, modal state |
| Form state | React Hook Form + Zod | Login form, task creation, settings |
| URL state | Next.js searchParams | Filters, pagination, search queries |

---

## API Communication

| Technology | Purpose |
|---|---|
| **Axios** | HTTP client — interceptors, request/response transformation |
| **WebSocket API** | Bidirectional real-time — live task updates, chat |
| **EventSource API** | Server-Sent Events — notifications, AI streaming |

---

## Authentication (Client-Side)

| Technology | Purpose |
|---|---|
| **NextAuth.js (Auth.js)** or custom | Session management — JWT handling, cookie management |
| **Middleware** (Next.js) | Route protection — redirect unauthenticated users |
| **HTTP-only cookies** | Token storage — secure, XSS-resistant token handling |

---

## File Handling

| Technology | Purpose |
|---|---|
| **react-dropzone** | Drag-and-drop file uploads — drop zones, file selection |
| **browser File API** | File reading — preview images, validate files before upload |

---

## Rich Text & Markdown

| Technology | Purpose |
|---|---|
| **Tiptap** or **Lexical** | Rich text editor — task descriptions, comments |
| **react-markdown** | Markdown rendering — display formatted content |

---

## Drag and Drop

| Technology | Purpose |
|---|---|
| **@dnd-kit** | Drag and drop — Kanban board columns, task reordering |

### Why @dnd-kit?

- Modern, lightweight, and performant
- Built for React with hooks-based API
- Excellent accessibility support
- Supports multiple drag strategies (pointer, keyboard, touch)
- Active maintenance and community

---

## Data Visualization

| Technology | Purpose |
|---|---|
| **Recharts** or **Chart.js** | Charts — project analytics, sprint burndown, dashboards |

---

## Testing

| Technology | Purpose |
|---|---|
| **Vitest** | Unit test runner — fast, Vite-powered, compatible with Jest API |
| **React Testing Library** | Component testing — test behavior, not implementation |
| **Playwright** | End-to-end testing — browser automation, cross-browser |
| **MSW (Mock Service Worker)** | API mocking — intercept network requests for testing |

---

## Code Quality

| Technology | Purpose |
|---|---|
| **ESLint** | Linting — code quality, consistency, error prevention |
| **Prettier** | Formatting — consistent code formatting |
| **Husky + lint-staged** | Git hooks — pre-commit quality checks |

---

## DevOps & Deployment

| Technology | Purpose |
|---|---|
| **Docker** | Containerization — consistent deployment environment |
| **Vercel** (recommended) | Hosting — optimized for Next.js, preview deployments |
| **GitHub Actions** | CI/CD — automated testing, building, and deployment |
| **Nginx** (alternative) | Self-hosted — reverse proxy, static file serving |

---

## Development Tools

| Tool | Purpose |
|---|---|
| **React DevTools** | Component inspection, profiling |
| **Next.js DevTools** | Route inspection, build analysis |
| **TanStack Query DevTools** | Cache inspection, query monitoring |
| **Axe DevTools** | Accessibility testing |
| **Lighthouse** | Performance auditing |

---

## Version Summary

```
Node.js             >= 20 LTS
Next.js             >= 14.0
React               >= 18.0
TypeScript          >= 5.0
Tailwind CSS        >= 3.4
React Query         >= 5.0
Zustand             >= 4.0
Radix UI            Latest
Playwright          Latest
```

> **Note**: Exact versions may change. Always check the official documentation for the latest compatible versions when you start building.
