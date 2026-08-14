/**
 * E2E tests — Authentication flows.
 *
 * These tests run in a real browser (via Playwright) against the running
 * Next.js app and a live or seeded backend.
 *
 * Covered flows:
 * - Successful login → redirect to dashboard
 * - Invalid credentials → error message stays on /login
 * - Password visibility toggle
 * - Unauthenticated user is redirected to /login when accessing a protected route
 */
import { expect, test } from '@playwright/test';

import { TEST_USER, loginAs } from './helpers/auth';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we start each test from a clean, logged-out state
    await page.goto('/login');
  });

  // ── Login page rendering ─────────────────────────────────────────────

  test('login page renders email and password fields', async ({ page }) => {
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  // ── Successful login ─────────────────────────────────────────────────

  test('valid credentials redirect the user to the dashboard', async ({
    page,
  }) => {
    await loginAs(page, TEST_USER.email, TEST_USER.password);

    // After successful login the user lands on the dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

  // ── Validation ───────────────────────────────────────────────────────

  test('submitting empty form shows validation errors', async ({ page }) => {
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('invalid credentials show an error and stay on /login', async ({
    page,
  }) => {
    await page.getByLabel(/email/i).fill('wrong@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();

    // The API returns an error toast / inline message
    await expect(
      page
        .getByText(/invalid/i)
        .or(page.getByText(/incorrect/i))
        .or(page.getByText(/failed/i)),
    ).toBeVisible({ timeout: 5_000 });

    await expect(page).toHaveURL(/\/login/);
  });

  // ── Password visibility toggle ───────────────────────────────────────

  test('password field starts as hidden and can be revealed', async ({
    page,
  }) => {
    const passwordInput = page.getByLabel(/password/i);
    await expect(passwordInput).toHaveAttribute('type', 'password');

    await page.getByRole('button', { name: /show password/i }).click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    await page.getByRole('button', { name: /hide password/i }).click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  // ── Protected route redirect ─────────────────────────────────────────

  test('unauthenticated user accessing /dashboard is redirected to /login', async ({
    page,
  }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/, { timeout: 5_000 });
  });
});
