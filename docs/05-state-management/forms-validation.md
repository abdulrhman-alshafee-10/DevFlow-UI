# State Management — Forms with React Hook Form + Zod

## What Is It?

**React Hook Form** is a performant form library that uses uncontrolled components and refs to minimize re-renders. **Zod** is a schema validation library that works seamlessly with TypeScript for runtime validation.

## Why Does It Matter?

- **Performance** — React Hook Form doesn't re-render the entire form on every keystroke
- **Validation** — Zod provides type-safe validation with clear error messages
- **Single source of truth** — Zod schema defines both TypeScript type and validation rules
- **Form state** — Handles dirty fields, touched fields, submission state, errors

## How Does It Fit into DevFlow?

### Task Creation Form

```typescript
// lib/validations/task.ts
import { z } from "zod";

export const taskCreateSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(500, "Title must be less than 500 characters"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "critical"], {
    errorMap: () => ({ message: "Select a valid priority" }),
  }),
  assignee_id: z.string().uuid().optional().nullable(),
  due_date: z.string().datetime().optional().nullable(),
});

export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
```

```tsx
// components/features/tasks/task-create-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskCreateSchema, type TaskCreateInput } from "@/lib/validations/task";

export function TaskCreateForm({ projectId, onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TaskCreateInput>({
    resolver: zodResolver(taskCreateSchema),
    defaultValues: {
      priority: "medium",
    },
  });

  const onSubmit = async (data: TaskCreateInput) => {
    await createTask.mutateAsync({ ...data, projectId });
    reset();
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Title"
        error={errors.title?.message}
        {...register("title")}
      />
      <Textarea
        label="Description"
        {...register("description")}
      />
      <Select
        label="Priority"
        error={errors.priority?.message}
        {...register("priority")}
        options={["low", "medium", "high", "critical"]}
      />
      <Button type="submit" loading={isSubmitting}>
        Create Task
      </Button>
    </form>
  );
}
```

## Common Mistakes

1. **Not using zodResolver** — Manual validation instead of schema-driven
2. **Controlled inputs** — React Hook Form works best with uncontrolled inputs via `register`
3. **Not handling submission errors** — Show server-side errors from the API
4. **Complex Zod schemas** — Keep schemas simple, compose with `.merge()` and `.extend()`

## What I Should Be Able to Do Afterward

- [ ] Create Zod schemas for form validation
- [ ] Infer TypeScript types from Zod schemas
- [ ] Set up React Hook Form with zodResolver
- [ ] Handle form submission with loading and error states
- [ ] Display field-level validation errors
- [ ] Implement multi-step forms and dynamic fields
