import { NextRequest, NextResponse } from 'next/server';

/**
 * Routes accessible without authentication.
 * Prefix-matched: `/login` also matches `/login?callbackUrl=…`.
 */
const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
];

/**
 * Routes that are always public regardless of auth state
 * (static assets etc. are excluded via the matcher below).
 */
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) =>
      pathname === p ||
      pathname.startsWith(p + '/') ||
      pathname.startsWith(p + '?'),
  );
}

/**
 * Next.js Edge Middleware — runs before every matched request.
 *
 * Rules:
 * 1. Public path + authenticated → redirect to /dashboard (skip login screen)
 * 2. Protected path + unauthenticated → redirect to /login?callbackUrl=<path>
 * 3. Everything else → pass through
 *
 * Auth check: presence of `access_token` OR `refresh_token` cookie.
 * We check both because the access token may have already expired while the
 * refresh token is still valid — the Axios 401 interceptor handles the
 * actual refresh on the first protected API call.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasAccessToken = Boolean(request.cookies.get('access_token')?.value);
  const hasRefreshToken = Boolean(request.cookies.get('refresh_token')?.value);
  const isAuthenticated = hasAccessToken || hasRefreshToken;

  // ── Security headers ────────────────────────────────────────────────────
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()',
  );

  // ── Route protection ────────────────────────────────────────────────────
  if (isPublicPath(pathname)) {
    // Authenticated users don't need the auth pages — send to dashboard
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return response;
  }

  // Protected route without a session — capture intended destination
  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

/**
 * Matcher — run middleware on every route EXCEPT:
 * - Next.js internal routes (_next/static, _next/image)
 * - API routes (/api/…)
 * - Static files (favicon, images, fonts)
 */
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon\\.ico|favicon\\.svg|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|otf)).*)',
  ],
};
