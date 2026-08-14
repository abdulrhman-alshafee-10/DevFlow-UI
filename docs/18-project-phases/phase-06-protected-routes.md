# Phase 6 — Protected Routes & Middleware

## Objective

Secure the application by implementing Next.js Middleware to protect private routes. Ensure unauthenticated users cannot access the dashboard and authenticated users bypass the login screen. Also, handle token refresh logic.

---

## Concepts Learned

- Next.js Edge Middleware
- Route protection strategies
- Axios interceptors for handling 401 Unauthorized
- Token refresh flow

**Relevant docs**:

- `03-nextjs/middleware-config.md`
- `06-api-integration/client-setup.md`
- `07-authentication/authorization-ui.md`

---

## Features After This Phase

- [x] Middleware redirects unauthenticated users from `/dashboard` to `/login`
- [x] Middleware redirects authenticated users from `/login` to `/dashboard`
- [x] Axios interceptor automatically attempts to refresh access tokens on 401 responses
- [x] Failed token refresh smoothly logs the user out and redirects to login

---

## Implementation Details

### 1. Next.js Middleware

Create `src/middleware.ts`. It should check for the presence of the `access_token` or `refresh_token` cookie. If missing on a protected route, redirect to `/login?callbackUrl=...`.

### 2. Axios Interceptors

Update `src/lib/api/client.ts`. Add a response interceptor that catches `401` errors. If it catches one, it should call the backend `/api/v1/auth/refresh` endpoint. If successful, retry the original request. If it fails, clear the local store and redirect to login.

### 3. PermissionGate Component

Create a utility component `PermissionGate` that takes a `role` or `permission` prop and conditionally renders its children based on the current user's role.

---

## Completion Checklist

- [x] Create `src/middleware.ts` with route protection logic
- [x] Define the `matcher` array in middleware to optimize execution
- [x] Update Axios client with a 401 response interceptor
- [x] Implement the `refresh` API call in `authApi`
- [x] Create the `PermissionGate` component
- [ ] Test the middleware by manually deleting cookies and trying to access the dashboard
- [ ] Test the refresh flow by manually expiring the access token (if backend supports short expiration for testing)
