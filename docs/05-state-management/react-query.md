# State Management — React Query (Server State)

## What Is It?

**React Query (TanStack Query)** is a library for managing **server state** — data that comes from your API. It handles caching, background refetching, optimistic updates, pagination, and more.

## Why Does It Matter?

Without React Query, you write this in every component:

```tsx
// 😩 Without React Query
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  fetchTasks()
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false));
}, []);
```

With React Query:

```tsx
// 😎 With React Query
const { data, isLoading, error } = useQuery({
  queryKey: ["tasks", projectId],
  queryFn: () => api.getTasks(projectId),
});
```

## Key Features for DevFlow

### Caching & Deduplication

```tsx
// Multiple components can use the same query — only ONE request is made
function TaskBoard() {
  const { data } = useQuery({ queryKey: ["tasks", projectId], queryFn: fetchTasks });
}

function TaskCount() {
  // Same query key = uses cached data, no extra request
  const { data } = useQuery({ queryKey: ["tasks", projectId], queryFn: fetchTasks });
}
```

### Mutations with Optimistic Updates

```tsx
const updateTask = useMutation({
  mutationFn: (data: TaskUpdate) => api.updateTask(data.id, data),
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ["tasks"] });

    // Snapshot previous value
    const previous = queryClient.getQueryData(["tasks"]);

    // Optimistically update the cache
    queryClient.setQueryData(["tasks"], (old) =>
      old.map(t => t.id === newData.id ? { ...t, ...newData } : t)
    );

    return { previous };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(["tasks"], context.previous);
  },
  onSettled: () => {
    // Always refetch to sync with server
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  },
});
```

### Pagination

```tsx
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ["tasks", projectId, filters],
  queryFn: ({ pageParam = 1 }) => api.getTasks(projectId, { page: pageParam }),
  getNextPageParam: (lastPage) => lastPage.has_more ? lastPage.page + 1 : undefined,
});
```

## Common Mistakes

1. **Not setting staleTime** — Default is 0, which refetches on every focus
2. **Query keys too broad** — Include all dependencies in the query key
3. **Forgetting to invalidate** — After mutations, invalidate related queries
4. **Using React Query for client state** — It's for server state only; use Zustand for UI state

## What I Should Be Able to Do Afterward

- [ ] Set up React Query with a QueryClient and provider
- [ ] Use useQuery for data fetching with proper query keys
- [ ] Use useMutation for create/update/delete operations
- [ ] Implement optimistic updates for instant UI feedback
- [ ] Handle pagination with useInfiniteQuery
- [ ] Invalidate and refetch queries after mutations
- [ ] Configure staleTime, cacheTime, and retry settings
