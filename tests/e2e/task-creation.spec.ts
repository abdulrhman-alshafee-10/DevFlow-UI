/**
 * E2E tests — Task creation flow.
 *
 * These tests verify that a logged-in user can navigate to a project's
 * board and successfully create a new task via the modal form.
 *
 * Prerequisites:
 * - The test user (`TEST_USER`) exists in the seeded database.
 * - At least one project is accessible to the test user.
 *   The project slug/id is read from `E2E_PROJECT_ID` env var (defaults to
 *   `test-project` as a sensible dev fallback).
 */
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers/auth';

const PROJECT_ID = process.env['E2E_PROJECT_ID'] ?? 'test-project';

test.describe('Task Management', () => {
  // Log in once before every test in this describe block
  test.beforeEach(async ({ page }) => {
    await loginAs(page);
    await page.goto(`/projects/${PROJECT_ID}`);
    // Wait for the board to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  // ── Create task ──────────────────────────────────────────────────────

  test('user can open the Create Task dialog', async ({ page }) => {
    // The trigger button may say "Create Task", "+ Task", or similar
    const createBtn = page
      .getByRole('button', { name: /create task/i })
      .or(page.getByRole('button', { name: /\+ task/i }))
      .or(page.getByRole('button', { name: /new task/i }));

    await expect(createBtn.first()).toBeVisible();
    await createBtn.first().click();

    // A modal/dialog should open
    await expect(
      page.getByRole('dialog').or(page.getByRole('alertdialog')),
    ).toBeVisible();
  });

  test('user can create a task with a title and priority', async ({ page }) => {
    const uniqueTitle = `E2E Task ${Date.now()}`;

    // Open the create task dialog
    const createBtn = page
      .getByRole('button', { name: /create task/i })
      .or(page.getByRole('button', { name: /\+ task/i }))
      .or(page.getByRole('button', { name: /new task/i }));

    await createBtn.first().click();

    // Fill in the title field
    const titleInput = page.getByRole('textbox', { name: /title/i });
    await expect(titleInput).toBeVisible();
    await titleInput.fill(uniqueTitle);

    // Select a priority
    const prioritySelect = page
      .getByRole('combobox', { name: /priority/i })
      .or(page.getByLabel(/priority/i));

    if (await prioritySelect.isVisible()) {
      await prioritySelect.selectOption('high');
    }

    // Submit the form
    const submitBtn = page.getByRole('button', { name: /create/i }).last();
    await submitBtn.click();

    // The dialog should close and the new task should appear on the board
    await expect(
      page.getByRole('dialog').or(page.getByRole('alertdialog')),
    ).not.toBeVisible({ timeout: 5_000 });

    // The task card with our unique title should now be visible on the board
    await expect(page.getByText(uniqueTitle)).toBeVisible({ timeout: 10_000 });
  });

  test('create task form shows validation error when title is empty', async ({
    page,
  }) => {
    const createBtn = page
      .getByRole('button', { name: /create task/i })
      .or(page.getByRole('button', { name: /\+ task/i }))
      .or(page.getByRole('button', { name: /new task/i }));

    await createBtn.first().click();

    // Try to submit with an empty title
    const submitBtn = page.getByRole('button', { name: /create/i }).last();
    await submitBtn.click();

    // Should show a validation message — dialog stays open
    await expect(
      page
        .getByText(/title is required/i)
        .or(page.getByText(/required/i).first()),
    ).toBeVisible();

    await expect(
      page.getByRole('dialog').or(page.getByRole('alertdialog')),
    ).toBeVisible();
  });

  // ── Navigation ───────────────────────────────────────────────────────

  test('navigating to a project shows the kanban board', async ({ page }) => {
    // Expect to see at least one status column header (e.g. "Todo", "In Progress", "Done")
    const columnHeaders = page
      .getByText(/todo/i)
      .or(page.getByText(/in progress/i))
      .or(page.getByText(/backlog/i));

    await expect(columnHeaders.first()).toBeVisible();
  });
});
