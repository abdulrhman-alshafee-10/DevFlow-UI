# Search — Global Search UI

## What Is It?

A **global search interface** that allows users to search across tasks, projects, and comments from anywhere in the application using a keyboard-triggered command palette.

## Why Does It Matter?

- **Productivity** — Power users expect Cmd+K / Ctrl+K global search
- **Discoverability** — Find tasks, projects, and members quickly
- **Modern UX** — Command palettes are standard in tools like GitHub, Linear, Notion

## How Does It Fit into DevFlow?

### Command Palette Component

```tsx
"use client";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const { data: results, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchApi.search(debouncedQuery),
    enabled: debouncedQuery.length > 1,
  });

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <Input
          placeholder="Search tasks, projects, members..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <SearchResults results={results} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
}
```

## Common Mistakes

1. **No debouncing** — Sending a request on every keystroke
2. **No keyboard navigation** — Arrow keys should navigate results
3. **Not grouping results** — Group by type (tasks, projects, members)
4. **Slow search** — Use debounce + cancel previous requests

## What I Should Be Able to Do Afterward

- [ ] Build a command palette with keyboard shortcut activation
- [ ] Implement debounced search input
- [ ] Display grouped, navigable search results
- [ ] Handle keyboard navigation within results
- [ ] Navigate to selected result on Enter
