import { FolderKanban, AlertCircle } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import type { RecentProject } from '@/lib/api/users';
import type { Status } from '@/types';

interface RecentProjectsProps {
  projects: RecentProject[] | undefined;
  isLoading: boolean;
  hasError: boolean;
}

/**
 * Maps ProjectStatus → Status for the badge resolver.
 * 'active' → 'in_progress', 'completed' → 'done', 'archived' → 'archived'
 */
function projectStatusToTaskStatus(status: RecentProject['status']): Status {
  const map: Record<RecentProject['status'], Status> = {
    active: 'in_progress',
    completed: 'done',
    archived: 'archived',
  };
  return map[status];
}

/**
 * Widget listing the user's recently updated projects.
 */
export function RecentProjects({
  projects,
  isLoading,
  hasError,
}: RecentProjectsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <FolderKanban
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <CardTitle>Recent Projects</CardTitle>
        </div>
        <CardDescription>Projects you recently worked in</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Spinner label="Loading projects" />
          </div>
        )}

        {hasError && !isLoading && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
            Failed to load projects.
          </div>
        )}

        {!isLoading && !hasError && projects?.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No recent projects yet.
          </p>
        )}

        {!isLoading && !hasError && projects && projects.length > 0 && (
          <ul className="divide-y divide-border" role="list">
            {projects.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/projects/${project.id}`}
                  className="flex items-center justify-between gap-3 py-3 transition-opacity first:pt-0 last:pb-0 hover:opacity-80"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {project.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {project.taskCount}{' '}
                      {project.taskCount === 1 ? 'task' : 'tasks'}
                    </p>
                  </div>
                  <Badge status={projectStatusToTaskStatus(project.status)}>
                    {project.status}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
