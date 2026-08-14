/**
 * E2E auth helpers — reusable login / logout utilities for Playwright tests.
 *
 * Using these helpers keeps test files DRY and centralises the selectors
 * that drive authentication flows.
 */
import type { Page } from '@playwright/test';

/** Credentials used by the test seed/fixture user. */
export const TEST_USER = {
  email: process.env['E2E_USER_EMAIL'] ?? 'test@devflow.com',
  password: process.env['E2E_USER_PASSWORD'] ?? 'password123',
} as const;

/**
 * Navigate to `/login` and submit the login form with the provided credentials.
 *
 * Waits for the URL to change away from `/login` before resolving, so
 * callers can immediately assert on the post-login state.
 */
export async function loginAs(
  page: Page,
  email = TEST_USER.email,
  password = TEST_USER.password,
): Promise<void> {
  await page.goto('/login');

  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();

  // Wait until the browser navigates away from the login page
  await page.waitForURL((url) => !url.pathname.startsWith('/login'), {
    timeout: 10_000,
  });
}
