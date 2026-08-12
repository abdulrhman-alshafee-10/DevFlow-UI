# API Integration — TypeScript Types

## What Is It?

**TypeScript types** that mirror your FastAPI Pydantic schemas. These types ensure that the data flowing between your frontend and backend is consistent and type-checked at compile time.

## Why Does It Matter?

- **Contract enforcement** — If the backend changes a field, TypeScript catches it
- **Autocomplete** — IDE knows exactly what fields are available on each object
- **Refactoring safety** — Rename a field and TypeScript shows every usage
- **Documentation** — Types serve as living documentation of your API

## Mapping Pydantic Schemas to TypeScript

### User Types

```typescript
// types/user.ts

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string; // ISO 8601 datetime
  updated_at: string;
}

export interface UserCreate {
  email: string;
  password: string;
  full_name: string;
}

export interface UserUpdate {
  full_name?: string;
  avatar_url?: string | null;
}
```

### Task Types

```typescript
// types/task.ts

export type TaskStatus = "todo" | "in_progress" | "in_review" | "done" | "cancelled";
export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  creator_id: string;
  assignee_id: string | null;
  due_date: string | null;
  position: number;
  created_at: string;
  updated_at: string;
  // Expanded relations
  creator?: User;
  assignee?: User;
  comments_count?: number;
  attachments_count?: number;
}

export interface TaskCreate {
  title: string;
  description?: string;
  priority?: TaskPriority;
  assignee_id?: string | null;
  due_date?: string | null;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee_id?: string | null;
  due_date?: string | null;
  position?: number;
}

export interface TaskQueryParams {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee_id?: string;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  size?: number;
}
```

### Generic API Types

```typescript
// types/api.ts

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  has_more: boolean;
}

export interface ApiErrorResponse {
  detail: string;
  code: string;
  errors?: FieldError[];
}

export interface FieldError {
  field: string;
  message: string;
}
```

## Common Mistakes

1. **Using `any` for API responses** — Always type your responses
2. **Duplicating backend enums** — Keep string literal unions in sync with backend
3. **Not handling nullable fields** — FastAPI returns `null`, not `undefined`
4. **Date types** — API returns ISO strings, not Date objects; parse when needed

## What I Should Be Able to Do Afterward

- [ ] Define TypeScript interfaces that match Pydantic schemas
- [ ] Use string literal unions for status/priority enums
- [ ] Create generic types for paginated responses
- [ ] Handle nullable vs optional fields correctly
- [ ] Keep frontend types in sync with backend schemas
