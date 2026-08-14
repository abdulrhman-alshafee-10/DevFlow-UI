/**
 * MSW request handlers for unit/component tests.
 *
 * These intercept HTTP calls at the network level so tests never reach
 * a real server. Import and override individual handlers inside a test
 * with `server.use(...)` when you need a different response.
 */
import { http, HttpResponse } from 'msw';

import type { User } from '@/types';

const BASE = 'http://localhost:8000';

/** A reusable mock user returned by successful auth calls. */
export const mockUser: User = {
  id: 'user-1',
  email: 'test@devflow.com',
  displayName: 'Test User',
  avatarUrl: null,
  role: 'member',
  isVerified: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

export const handlers = [
  // ── Auth ──────────────────────────────────────────────────────────────────

  http.post(`${BASE}/api/v1/auth/login`, async ({ request }) => {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    if (body.email === 'test@devflow.com' && body.password === 'password123') {
      return HttpResponse.json(mockUser, { status: 200 });
    }

    return HttpResponse.json(
      { detail: 'Invalid email or password.' },
      { status: 401 },
    );
  }),

  http.get(`${BASE}/api/v1/auth/me`, () => {
    // Default: return 401 (not authenticated) so tests start from a logged-out state
    return HttpResponse.json({ detail: 'Not authenticated.' }, { status: 401 });
  }),

  http.post(`${BASE}/api/v1/auth/logout`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // ── Token refresh — always fail in tests (prevents infinite retry loops) ──
  http.post(`${BASE}/api/v1/auth/refresh`, () => {
    return HttpResponse.json({ detail: 'Token expired.' }, { status: 401 });
  }),
];
