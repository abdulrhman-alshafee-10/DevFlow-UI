# React — Component Patterns

## What Is It?

Component patterns are **proven approaches to structuring React components** for reusability, testability, and maintainability. They define how components communicate, share logic, and compose together.

## Key Patterns for DevFlow

### Composition Pattern

Build complex UIs by composing simple components:

```tsx
<Modal>
  <Modal.Header>Create Task</Modal.Header>
  <Modal.Body>
    <TaskForm onSubmit={handleSubmit} />
  </Modal.Body>
  <Modal.Footer>
    <Button variant="ghost" onClick={onClose}>Cancel</Button>
    <Button variant="primary" type="submit">Create</Button>
  </Modal.Footer>
</Modal>
```

### Container / Presentational Pattern

Separate data fetching from UI rendering:

```tsx
// Container — handles data and logic
function TaskBoardContainer({ projectId }: { projectId: string }) {
  const { data: tasks, isLoading } = useTasks(projectId);
  const mutation = useUpdateTask();

  if (isLoading) return <TaskBoardSkeleton />;
  return <TaskBoard tasks={tasks} onTaskMove={mutation.mutate} />;
}

// Presentational — pure UI
function TaskBoard({ tasks, onTaskMove }: TaskBoardProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {columns.map(col => (
        <TaskColumn key={col} tasks={tasks.filter(t => t.status === col)} />
      ))}
    </div>
  );
}
```

### Render Props Pattern

Share logic between components via a function prop:

```tsx
<AuthGuard requiredPermission="task:create" fallback={<Unauthorized />}>
  {(user) => <TaskCreateForm creatorId={user.id} />}
</AuthGuard>
```

### Higher-Order Component Pattern (HOC)

Wrap a component to add behavior:

```tsx
function withAuth<P>(Component: React.ComponentType<P & { user: User }>) {
  return function AuthenticatedComponent(props: P) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return <Component {...props} user={user} />;
  };
}
```

### Controlled vs. Uncontrolled Components

```tsx
// Controlled — parent manages state
<Input value={title} onChange={(e) => setTitle(e.target.value)} />

// Uncontrolled — component manages own state
<Input defaultValue="Default title" ref={inputRef} />
```

## Common Mistakes

1. **God components** — Components doing too much (split them!)
2. **Prop drilling** — Pass data through 5 levels (use context or state management)
3. **Tight coupling** — Components depending on specific parent structure
4. **Not memoizing callbacks** — Causing unnecessary child re-renders

## What I Should Be Able to Do Afterward

- [ ] Apply composition pattern for flexible component APIs
- [ ] Separate container and presentational concerns
- [ ] Use render props for cross-cutting logic
- [ ] Choose between controlled and uncontrolled components
- [ ] Build compound components (like Modal with subcomponents)
