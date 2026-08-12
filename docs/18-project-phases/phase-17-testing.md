# Phase 17 — Testing

## Objective

Set up the testing environment and write core tests for the frontend to ensure stability and prevent regressions.

---

## Concepts Learned

- Unit testing components with React Testing Library
- Mocking API calls with Mock Service Worker (MSW)
- End-to-end testing user flows with Playwright

**Relevant docs**:
- `12-testing/unit-component-testing.md`
- `12-testing/e2e-testing.md`

---

## Features After This Phase

- [ ] Vitest test runner configured
- [ ] Playwright configured
- [ ] Core unit tests for critical components (e.g., Auth forms, Task card)
- [ ] E2E test for the login flow
- [ ] E2E test for the task creation flow

---

## Completion Checklist

- [ ] Install `vitest`, `@testing-library/react`, and `msw`
- [ ] Write a unit test for the `Button` and `Input` components
- [ ] Write a component test for `LoginForm` (mocking the API with MSW)
- [ ] Install `@playwright/test`
- [ ] Write an E2E test that logs in, navigates to a project, and creates a task
- [ ] Ensure `npm run test` and `npm run test:e2e` pass
