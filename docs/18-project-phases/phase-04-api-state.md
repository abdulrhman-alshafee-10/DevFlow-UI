# Phase 4 — API Client & State Management

## Objective

Set up the communication layer between the frontend and the FastAPI backend. Configure Axios, set up TypeScript types for API responses, and initialize React Query and Zustand.

---

## Concepts Learned

- Axios interceptors
- Type-safe API client design
- React Query initialization and DevTools
- Zustand store creation
- Environment variable configuration

**Relevant docs**:

- `06-api-integration/client-setup.md`
- `06-api-integration/typescript-types.md`
- `05-state-management/react-query.md`
- `05-state-management/zustand.md`

---

## Features After This Phase

- [x] Centralized Axios client configured with the backend URL
- [x] TypeScript interfaces matching the backend models
- [x] React Query Provider wrapping the application
- [x] Zustand stores defined for UI and Auth state
- [x] React Query DevTools available in development

---

## Implementation Details

### 1. API Client

Create an Axios instance that defaults to `http://localhost:8000` (or the URL from `.env.local`). It should include `withCredentials: true` to support HTTP-only cookies from the backend.

### 2. TypeScript Types

Create type definitions in `src/types/` for:

- `User`
- `Organization`
- `Project`
- `Task` (including Status and Priority enums)
- `ApiErrorResponse`
- `PaginatedResponse<T>`

### 3. Providers

Create a `Providers` component to wrap the children in `app/layout.tsx`. This should include the `QueryClientProvider` and `ReactQueryDevtools`.

---

## Completion Checklist

- [x] Install `axios`, `@tanstack/react-query`, and `@tanstack/react-query-devtools`
- [x] Install `zustand`
- [x] Ensure `NEXT_PUBLIC_API_URL` is in `.env.local`
- [x] Create `src/lib/api/client.ts` with the Axios instance
- [x] Define base TypeScript interfaces in `src/types/`
- [x] Set up the `QueryClient` and `Providers` component
- [x] Wrap the root layout with the `Providers` component
- [x] Create `src/stores/ui-store.ts` for managing sidebar state
- [x] Create `src/stores/auth-store.ts` for managing user state
