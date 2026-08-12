# Next.js — Server vs Client Components

## What Is It?

Next.js App Router introduces two types of React components:

- **Server Components** (default) — Render on the server, send HTML to the client
- **Client Components** (`"use client"`) — Render on both server and client, support interactivity

## Why Does It Matter?

- **Performance** — Server Components reduce client-side JavaScript (smaller bundles)
- **Security** — Sensitive logic (API keys, database queries) stays on the server
- **SEO** — Server-rendered HTML is immediately available to search engines
- **Data fetching** — Server Components can fetch data without useEffect or loading states

## How Does It Work?

```
Server Component (default)          Client Component ("use client")
├── Renders on server only          ├── Renders on server (initial HTML)
├── Can access server resources     │   then hydrates on client
├── Cannot use hooks (useState)     ├── Can use hooks and event handlers
├── Cannot use browser APIs         ├── Can access browser APIs
├── Sends zero JS to client         ├── Sends JS bundle to client
└── Great for static/data display   └── Required for interactivity
```

## When to Use Each

| Use Server Component When | Use Client Component When |
|---|---|
| Displaying data (task list, project info) | Handling user input (forms, buttons) |
| Accessing backend data | Using useState, useEffect, useRef |
| Rendering markdown or static content | Using browser APIs (localStorage, window) |
| Showing content that doesn't change on interaction | Implementing drag-and-drop |
| SEO-critical content | Real-time updates (WebSocket listeners) |

## How Does It Fit into DevFlow?

```tsx
// Server Component — fetches and displays project data
// app/(dashboard)/projects/[projectId]/page.tsx
export default async function ProjectPage({ params }: Props) {
  const project = await getProject(params.projectId); // Server-side fetch
  return (
    <div>
      <h1>{project.name}</h1>
      <ProjectDescription content={project.description} />
      {/* Client Component for interactivity */}
      <TaskBoard projectId={params.projectId} />
    </div>
  );
}
```

```tsx
// Client Component — handles drag and drop
// components/features/tasks/task-board.tsx
"use client";

import { useState } from "react";
import { DndContext } from "@dnd-kit/core";

export function TaskBoard({ projectId }: { projectId: string }) {
  const { data: tasks } = useTasks(projectId);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  // ... interactive board logic
}
```

## The Boundary Rule

Client Components can import and render Server Components, but **Server Components cannot import Client Components directly**. Instead, pass Server Components as children:

```tsx
// ✅ Correct: Server Component as children of Client Component
<ClientSidebar>
  <ServerNav />   {/* This is a Server Component */}
</ClientSidebar>

// ❌ Wrong: Importing Server Component in Client Component
"use client";
import { ServerNav } from "./server-nav"; // This won't work as expected
```

## Common Mistakes

1. **Making everything a Client Component** — Losing the performance benefits
2. **Using `"use client"` at the page level** — Push it down to the smallest interactive component
3. **Forgetting the boundary rule** — Server Component imports in Client Components
4. **Trying to use hooks in Server Components** — useState, useEffect don't work

## What I Should Be Able to Do Afterward

- [ ] Choose the right component type for each use case
- [ ] Structure components to minimize Client Component boundaries
- [ ] Pass Server Components as children to Client Components
- [ ] Fetch data in Server Components without useEffect
- [ ] Understand the performance implications of each type
