'use client';

import { use, type ReactNode } from 'react';

import { useProject } from '@/hooks/use-projects';
import { ProjectNavTabs } from '@/components/projects/project-nav-tabs';
import { ProjectStatusBadge } from '@/components/projects/project-status-badge';
import { Spinner } from '@/components/ui/spinner';

interface LayoutProps {
  children: ReactNode;
  /** Parallel route slot — renders the task detail modal when intercepted. */
  modal: ReactNode;
  params: Promise<{ projectId: string }>;
}

/**
 * Project detail layout.
 *
 * Fetches the project, renders its name + status as a sub-header,
 * then mounts the project nav tabs (Board / List / Settings) above
 * whatever page is nested beneath.
 *
 * The `modal` parallel route slot renders the task detail intercept
 * when a user clicks a task card — the board stays in the background.
 */
export default function ProjectLayout({
  children,
  modal,
  params,
}: LayoutProps) {
  const { projectId } = use(params);
  const { project, isLoading } = useProject(projectId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner label="Loading project" />
      </div>
    );
  }

  return (
    <div className="-m-4 flex flex-col gap-0 md:-m-6">
      {/* Project sub-header */}
      <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 md:px-6">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold leading-tight">
            {project?.name ?? 'Project'}
          </h1>
        </div>
        {project && (
          <ProjectStatusBadge status={project.status} className="shrink-0" />
        )}
      </div>

      {/* Tab navigation */}
      <ProjectNavTabs projectId={projectId} />

      {/* Page content */}
      <div className="p-4 md:p-6">{children}</div>

      {/* Modal slot — rendered on top of content when a task is intercepted */}
      {modal}
    </div>
  );
}
