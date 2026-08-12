# React — Hooks

## What Is It?

Hooks are functions that let you **use state and other React features** in functional components. They were introduced in React 16.8 and eliminated the need for class components.

## Why Does It Matter?

- **Simpler components** — No class syntax, lifecycle methods, or `this` binding
- **Reusable logic** — Extract component logic into custom hooks
- **Composition** — Compose multiple hooks together
- **Better DX** — Easier to test, easier to read, easier to refactor

## Core Hooks for DevFlow

### useState — Local State

```typescript
const [isOpen, setIsOpen] = useState(false);
const [tasks, setTasks] = useState<Task[]>([]);
```

### useEffect — Side Effects

```typescript
useEffect(() => {
  const ws = new WebSocket(url);
  ws.onmessage = handleMessage;
  return () => ws.close(); // Cleanup
}, [url]);
```

### useCallback — Stable References

```typescript
const handleTaskUpdate = useCallback((taskId: string, updates: Partial<Task>) => {
  mutation.mutate({ taskId, updates });
}, [mutation]);
```

### useMemo — Expensive Computations

```typescript
const filteredTasks = useMemo(() =>
  tasks.filter(t => t.status === selectedStatus),
  [tasks, selectedStatus]
);
```

### useRef — DOM References & Mutable Values

```typescript
const inputRef = useRef<HTMLInputElement>(null);
const wsRef = useRef<WebSocket | null>(null);
```

## Custom Hooks in DevFlow

```typescript
// useDebounce — Delay search input
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

// useLocalStorage — Persist state
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}
```

## Common Mistakes

1. **Missing dependencies in useEffect** — Stale closures and bugs
2. **useEffect for derived state** — Use useMemo or compute during render
3. **Unnecessary useCallback/useMemo** — Don't optimize prematurely
4. **Mutating state directly** — Always create new objects/arrays
5. **Effects without cleanup** — Memory leaks from subscriptions

## What I Should Be Able to Do Afterward

- [ ] Use all core hooks correctly (useState, useEffect, useCallback, useMemo, useRef)
- [ ] Create custom hooks that extract and reuse component logic
- [ ] Handle cleanup in useEffect for subscriptions and timers
- [ ] Understand when to use useCallback vs. useMemo
- [ ] Build hooks for debouncing, local storage, and media queries
