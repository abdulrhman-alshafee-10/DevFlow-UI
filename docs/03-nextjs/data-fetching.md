# Next.js — Data Fetching

## What Is It?

Next.js App Router provides multiple strategies for fetching data, each optimized for different use cases: **Server Components fetch**, **React Query**, **Server Actions**, and **Route Handlers**.

## Why Does It Matter?

Choosing the right data fetching strategy affects performance, user experience, and code complexity. The App Router's approach eliminates many of the patterns (like useEffect + loading state) that made React data fetching painful.

## Data Fetching Strategies

### 1. Server Component Fetch (Initial Load)

```tsx
// Runs on the server — no loading state needed
async function ProjectPage({ params }: Props) {
  const project = await api.getProject(params.projectId);
  return <ProjectDetails project={project} />;
}
```

### 2. React Query (Client-Side Dynamic Data)

```tsx
"use client";

function TaskBoard({ projectId }: Props) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => api.getTasks(projectId),
    staleTime: 30_000, // Cache for 30 seconds
  });

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorDisplay error={error} />;
  return <Board tasks={data} />;
}
```

### 3. Server Actions (Mutations)

```tsx
// app/actions/tasks.ts
"use server";

export async function createTask(formData: FormData) {
  const task = await api.createTask({
    title: formData.get("title") as string,
    // ...
  });
  revalidatePath("/projects");
  return task;
}
```

### 4. Route Handlers (API Proxy)

```tsx
// app/api/tasks/route.ts
export async function GET(request: NextRequest) {
  const token = request.cookies.get("access_token");
  const res = await fetch(`${BACKEND_URL}/api/v1/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return Response.json(await res.json());
}
```

## When to Use Each Strategy

| Strategy | Best For | Example |
|---|---|---|
| Server Component fetch | Initial page data, SEO content | Project details, user profile |
| React Query | Dynamic, interactive data | Task board, notifications |
| Server Actions | Form submissions, mutations | Create task, update settings |
| Route Handlers | API proxy, auth, webhooks | Token refresh, file uploads |

## Common Mistakes

1. **Waterfalls** — Fetching sequentially when parallel fetch is possible
2. **Overfetching** — Fetching data you don't need
3. **Not caching** — Making the same request multiple times
4. **Client-side fetch for static data** — Use Server Components instead

## What I Should Be Able to Do Afterward

- [ ] Fetch data in Server Components for initial page loads
- [ ] Use React Query for dynamic, client-side data
- [ ] Implement Server Actions for form submissions
- [ ] Create Route Handlers for API proxy patterns
- [ ] Avoid data fetching waterfalls with parallel requests
- [ ] Cache and revalidate data effectively
