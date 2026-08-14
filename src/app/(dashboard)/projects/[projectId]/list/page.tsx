import { List } from 'lucide-react';

/**
 * Project List view — placeholder until Phase 10.
 */
export default function ProjectListPage() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card text-muted-foreground">
      <List className="size-8 opacity-40" aria-hidden="true" />
      <p className="text-sm">Task list view coming in Phase 10.</p>
    </div>
  );
}
