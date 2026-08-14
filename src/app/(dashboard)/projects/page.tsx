'use client';

import { useState } from 'react';
import { Plus, FolderKanban, LayoutGrid, List } from 'lucide-react';

import { useProjects } from '@/hooks/use-projects';
import { useOrgStore } from '@/stores/org-store';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { PermissionGate } from '@/components/auth/permission-gate';
import { ProjectCard } from '@/components/projects/project-card';
import { CreateProjectModal } from '@/components/projects/create-project-modal';
import { cn } from '@/lib/utils/cn';

type ViewMode = 'grid' | 'list';

export default function ProjectsPage() {
  const activeOrg = useOrgStore((s) => s.activeOrg);
  const [createOpen, setCreateOpen] = useState(false);
  const [view, setView] = useState<ViewMode>('grid');

  const { projects, isLoading, error, deleteProject, isDeleting } =
    useProjects();

  // ── No org selected ────────────────────────────────────────────────────
  if (!activeOrg) {
    return (
      <div className="flex min-h-64 animate-fade-in-up flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card text-muted-foreground">
        <FolderKanban className="size-8 opacity-40" aria-hidden="true" />
        <p className="text-sm">Select or create an organization first.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeOrg.name} · {projects.length} project
            {projects.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="hidden items-center rounded-md border border-border p-0.5 sm:flex">
            <button
              type="button"
              aria-label="Grid view"
              aria-pressed={view === 'grid'}
              onClick={() => setView('grid')}
              className={cn(
                'rounded p-1.5 transition-colors',
                view === 'grid'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <LayoutGrid className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="List view"
              aria-pressed={view === 'list'}
              onClick={() => setView('list')}
              className={cn(
                'rounded p-1.5 transition-colors',
                view === 'list'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <List className="size-4" aria-hidden="true" />
            </button>
          </div>

          <PermissionGate permission="project:create">
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" aria-hidden="true" />
              New project
            </Button>
          </PermissionGate>
        </div>
      </div>

      {/* Error */}
      {error && !isLoading && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Failed to load projects — {error.message}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Spinner label="Loading projects" />
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && projects.length === 0 && (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card text-muted-foreground">
          <FolderKanban className="size-8 opacity-40" aria-hidden="true" />
          <p className="text-sm">No projects yet.</p>
          <PermissionGate permission="project:create">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="size-4" aria-hidden="true" />
              Create your first project
            </Button>
          </PermissionGate>
        </div>
      )}

      {/* Grid view */}
      {!isLoading && projects.length > 0 && view === 'grid' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={deleteProject}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}

      {/* List view */}
      {!isLoading && projects.length > 0 && view === 'list' && (
        <div className="divide-y divide-border rounded-xl border border-border">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <ProjectCard
                project={project}
                onDelete={deleteProject}
                isDeleting={isDeleting}
              />
            </div>
          ))}
        </div>
      )}

      <CreateProjectModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
