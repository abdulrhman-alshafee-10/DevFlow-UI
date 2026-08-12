# TypeScript — Advanced Types

## What Is It?

Advanced TypeScript types go beyond basic annotations. They include **generics**, **conditional types**, **mapped types**, **template literal types**, and **type inference patterns** that let you model complex data relationships.

## Why Does It Matter?

- **API type safety** — Model exact API response shapes without `any`
- **Reusable components** — Generic components that work with multiple data types
- **State machines** — Discriminated unions for predictable state transitions
- **Type inference** — Let TypeScript infer types from Zod schemas and API responses

## How Does It Fit into DevFlow?

### Discriminated Unions for State

```typescript
type TaskState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; data: Task[] };

function renderTasks(state: TaskState) {
  switch (state.status) {
    case "loading": return <Spinner />;
    case "error":   return <Error message={state.error} />;
    case "success": return <TaskList tasks={state.data} />;
    // TypeScript ensures all cases are handled
  }
}
```

### Generic API Response Types

```typescript
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  has_more: boolean;
}

// Usage
type TaskListResponse = PaginatedResponse<Task>;
type ProjectListResponse = PaginatedResponse<Project>;
```

### Zod Schema Inference

```typescript
import { z } from "zod";

const taskCreateSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "critical"]),
  assignee_id: z.string().uuid().optional(),
});

// Infer TypeScript type from Zod schema — single source of truth
type TaskCreateInput = z.infer<typeof taskCreateSchema>;
```

## Common Mistakes

1. **Not using `as const`** — Missing narrow types for constant values
2. **Generic overuse** — Adding generics where a simple union would work
3. **Ignoring `never`** — Not using exhaustive checks in switch statements
4. **Complex conditional types** — Making types so complex they're unreadable

## What I Should Be Able to Do Afterward

- [ ] Create and use generic types and functions
- [ ] Build discriminated unions for state management
- [ ] Use mapped types to transform existing types
- [ ] Apply conditional types for flexible type logic
- [ ] Infer types from Zod schemas and other sources
- [ ] Use template literal types for string manipulation
- [ ] Implement exhaustive type checking with `never`
