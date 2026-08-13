import type { Metadata } from 'next';
import { FolderKanban } from 'lucide-react';

export const metadata: Metadata = { title: 'Projects' };

export default function ProjectsPage() {
  return (
    <div className="animate-fade-in-up space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          All projects your team is working on.
        </p>
      </div>

      <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card text-muted-foreground">
        <FolderKanban className="size-8 opacity-40" aria-hidden="true" />
        <p className="text-sm">
          Project list and kanban coming in a later phase.
        </p>
      </div>
    </div>
  );
}
