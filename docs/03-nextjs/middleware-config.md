# Next.js — Middleware & Configuration

## What Is It?

**Middleware** in Next.js runs **before** a request is completed. It can modify the request, redirect, rewrite, or set headers. It's perfect for authentication checks, redirects, and request modification.

**Configuration** (`next.config.js`) controls how Next.js builds and serves your application — image optimization, redirects, environment variables, and more.

## Why Does It Matter?

- **Route protection** — Redirect unauthenticated users before the page even loads
- **Organization switching** — Rewrite URLs based on the current organization
- **Security headers** — Add CSP, HSTS, and other headers globally
- **Performance** — Configure image optimization, caching, and compression

## How Does It Fit into DevFlow?

### Middleware for Auth Protection

```typescript
// middleware.ts (root of project)
import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/login", "/register", "/verify-email", "/reset-password"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    // Redirect to dashboard if already authenticated
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Protect all other routes
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

### Next.js Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "api.devflow.com" },
      { hostname: "*.s3.amazonaws.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

module.exports = nextConfig;
```

## Common Mistakes

1. **Heavy logic in middleware** — Middleware runs on every request; keep it fast
2. **Not matching routes** — Forgetting to configure the `matcher` pattern
3. **Exposing secrets** — Using `NEXT_PUBLIC_` prefix for sensitive variables
4. **Missing security headers** — Not configuring CSP, HSTS, X-Frame-Options

## What I Should Be Able to Do Afterward

- [ ] Create middleware for route protection
- [ ] Configure Next.js for images, headers, and environment variables
- [ ] Implement redirects based on authentication state
- [ ] Add security headers globally
- [ ] Understand the middleware execution model
