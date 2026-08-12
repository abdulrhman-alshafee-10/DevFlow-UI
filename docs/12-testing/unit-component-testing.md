# Testing — Unit & Component Testing

## What Is It?

**Unit tests** verify individual functions and hooks in isolation. **Component tests** verify that React components render correctly and respond to user interactions.

## Why Does It Matter?

- **Confidence** — Know your components work before deploying
- **Regression prevention** — Catch breaking changes automatically
- **Documentation** — Tests describe how components should behave
- **Refactoring safety** — Refactor with confidence that nothing breaks

## Key Libraries

| Library | Purpose |
|---|---|
| Vitest | Test runner (fast, Vite-powered, Jest-compatible) |
| React Testing Library | Render components, simulate user interactions |
| MSW (Mock Service Worker) | Mock API responses at the network level |
| @testing-library/user-event | Realistic user interaction simulation |

## How Does It Fit into DevFlow?

### Testing a Component

```typescript
// tests/unit/components/task-card.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskCard } from "@/components/features/tasks/task-card";

const mockTask = {
  id: "1",
  title: "Fix login bug",
  status: "in_progress",
  priority: "high",
  assignee: { full_name: "John" },
};

describe("TaskCard", () => {
  it("renders task title and priority", () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText("Fix login bug")).toBeInTheDocument();
    expect(screen.getByText("high")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<TaskCard task={mockTask} onClick={onClick} />);
    await userEvent.click(screen.getByText("Fix login bug"));
    expect(onClick).toHaveBeenCalledWith(mockTask.id);
  });
});
```

### Testing a Custom Hook

```typescript
// tests/unit/hooks/use-debounce.test.ts
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "@/hooks/use-debounce";

describe("useDebounce", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("returns debounced value after delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "hello" } }
    );

    expect(result.current).toBe("hello");

    rerender({ value: "world" });
    expect(result.current).toBe("hello"); // Not updated yet

    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe("world"); // Now updated
  });
});
```

### Mocking API with MSW

```typescript
// tests/mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/v1/tasks", () => {
    return HttpResponse.json({
      items: [{ id: "1", title: "Test Task", status: "todo" }],
      total: 1,
      page: 1,
      size: 20,
      has_more: false,
    });
  }),

  http.post("/api/v1/auth/login", async ({ request }) => {
    const body = await request.json();
    if (body.email === "test@test.com") {
      return HttpResponse.json({ user: { id: "1", email: "test@test.com" } });
    }
    return HttpResponse.json({ detail: "Invalid credentials" }, { status: 401 });
  }),
];
```

## Common Mistakes

1. **Testing implementation** — Test behavior, not internal state
2. **Snapshot abuse** — Snapshots are brittle; prefer explicit assertions
3. **Not mocking API** — Tests should never hit the real backend
4. **Skipping edge cases** — Test error states, loading states, empty states

## What I Should Be Able to Do Afterward

- [ ] Set up Vitest with React Testing Library
- [ ] Write component tests that test user behavior
- [ ] Test custom hooks with renderHook
- [ ] Mock API responses with MSW
- [ ] Test loading, error, and empty states
- [ ] Run tests in CI/CD pipeline
