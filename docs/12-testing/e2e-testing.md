# Testing — End-to-End Testing with Playwright

## What Is It?

**End-to-end (E2E) tests** test the entire application flow from the user's perspective, running in a real browser. **Playwright** is a modern E2E testing framework that supports Chromium, Firefox, and WebKit.

## Why Does It Matter?

- **Real user simulation** — Tests what users actually experience
- **Cross-browser** — Run the same tests in Chrome, Firefox, and Safari
- **Confidence** — If E2E tests pass, the feature works end-to-end
- **Visual regression** — Screenshot comparison to catch visual bugs

## How Does It Fit into DevFlow?

### Authentication E2E Test

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("user can log in and see dashboard", async ({ page }) => {
    await page.goto("/login");

    await page.fill('[name="email"]', "test@devflow.com");
    await page.fill('[name="password"]', "password123");
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByText("Welcome back")).toBeVisible();
  });

  test("shows error for invalid credentials", async ({ page }) => {
    await page.goto("/login");

    await page.fill('[name="email"]', "wrong@email.com");
    await page.fill('[name="password"]', "wrong");
    await page.click('button[type="submit"]');

    await expect(page.getByText("Invalid credentials")).toBeVisible();
    await expect(page).toHaveURL("/login");
  });
});
```

### Task Management E2E Test

```typescript
test.describe("Task Management", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "test@devflow.com", "password123");
  });

  test("user can create a task", async ({ page }) => {
    await page.goto("/projects/test-project");
    await page.click("text=Create Task");

    await page.fill('[name="title"]', "New E2E Task");
    await page.selectOption('[name="priority"]', "high");
    await page.click('button:has-text("Create")');

    await expect(page.getByText("New E2E Task")).toBeVisible();
    await expect(page.getByText("high")).toBeVisible();
  });
});
```

## Common Mistakes

1. **Flaky tests** — Use `waitFor` and proper selectors, not arbitrary timeouts
2. **Testing too much** — E2E is for critical paths; unit tests for details
3. **No test isolation** — Each test should start from a clean state
4. **Slow CI** — Run E2E tests in parallel with Playwright's sharding

## What I Should Be Able to Do Afterward

- [ ] Set up Playwright with Next.js
- [ ] Write E2E tests for critical user flows
- [ ] Create page objects for reusable test helpers
- [ ] Run tests across multiple browsers
- [ ] Integrate E2E tests into CI/CD pipeline
- [ ] Take screenshots for visual regression testing
