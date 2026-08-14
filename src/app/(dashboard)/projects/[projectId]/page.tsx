import { LayoutGrid } from 'lucide-react';

/**
 * Project Board page — placeholder until Phase 10 (Task Board).
 * The project header + nav tabs are rendered by the parent layout.
 */
export default function ProjectBoardPage() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card text-muted-foreground">
      <LayoutGrid className="size-8 opacity-40" aria-hidden="true" />
      <p className="text-sm">Task board coming in Phase 10.</p>
    </div>
  );
}
