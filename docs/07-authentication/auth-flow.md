# Authentication — Frontend Auth Flow

## What Is It?

Frontend authentication manages how users **log in**, **stay logged in**, and **access protected resources**. It involves token storage, session management, route protection, and handling token expiry.

## Why Does It Matter?

- **Security** — Tokens must be stored securely (HTTP-only cookies, not localStorage)
- **UX** — Seamless token refresh so users aren't constantly logged out
- **Route protection** — Unauthorized users can't access dashboard pages
- **Multi-tab** — Auth state synced across browser tabs

## How Does It Fit into DevFlow?

### Auth Flow

```
1. User submits login form
2. Frontend sends POST /api/v1/auth/login
3. Backend returns access_token + refresh_token (in HTTP-only cookies)
4. Frontend stores user data in Zustand
5. Next.js Middleware checks cookie on every request
6. Axios interceptor attaches token to API calls
7. On 401: interceptor refreshes token automatically
8. On refresh failure: redirect to /login
```

### Login Implementation

```tsx
// hooks/use-auth.ts
export function useAuth() {
  const { user, setUser, logout: clearStore } = useAuthStore();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginInput) => authApi.login(credentials),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearStore();
      queryClient.clear();
    },
  });

  return {
    user,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
  };
}
```

### Route Protection

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") ||
                     request.nextUrl.pathname.startsWith("/register");

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
```

## Common Mistakes

1. **Storing tokens in localStorage** — Vulnerable to XSS; use HTTP-only cookies
2. **Not refreshing tokens** — Users get logged out unnecessarily
3. **Race conditions** — Multiple 401s triggering multiple refresh requests
4. **Not clearing state on logout** — React Query cache and Zustand must be cleared

## What I Should Be Able to Do Afterward

- [ ] Implement login, register, and logout flows
- [ ] Store tokens securely with HTTP-only cookies
- [ ] Protect routes with Next.js Middleware
- [ ] Refresh tokens automatically on 401
- [ ] Build email verification and password reset UIs
- [ ] Show role-based UI elements
