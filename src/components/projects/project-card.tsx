'use client';

import Link from 'next/link';
import {
  CalendarDays,
  CheckSquare,
  Users,
  MoreHorizontal,
  Trash2,
  Settings,
} from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PermissionGate } from '@/components/auth/permission-gate';
import { ProjectStatusBadge } from './project-status-badge';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
  /** True while this specific project's delete mutation is pending. */
  isDeleting?: boolean;
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Project summary card for the grid view.
 * Clicking the card body navigates to the project board.
 * The three-dot menu provides settings and delete shortcuts.
 */
export function ProjectCard({
  project,
  onDelete,
  isDeleting,
}: ProjectCardProps) {
  const isOptimistic = project.id.startsWith('optimistic-');
  const dueDate = formatDate(project.dueDate);

  return (
    <Card
      className={cn(
        'group flex flex-col transition-shadow hover:shadow-md',
        isOptimistic && 'pointer-events-none animate-pulse opacity-70',
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          {/* Project name — links to board */}
          <Link
            href={`/projects/${project.id}`}
            className="line-clamp-2 min-w-0 flex-1 text-base font-semibold leading-tight transition-colors hover:text-primary"
          >
            {project.name}
          </Link>

          {/* Actions menu */}
          {!isOptimistic && (
            <PermissionGate permission="project:edit">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Actions for ${project.name}`}
                    className="shrink-0 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="size-4" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/projects/${project.id}/settings`}
                      className="flex items-center gap-2"
                    >
                      <Settings className="size-4" aria-hidden="true" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <PermissionGate permission="project:delete">
                    <DropdownMenuItem
                      onSelect={() => onDelete(project.id)}
                      disabled={isDeleting}
                      destructive
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      Delete project
                    </DropdownMenuItem>
                  </PermissionGate>
                </DropdownMenuContent>
              </DropdownMenu>
            </PermissionGate>
          )}
        </div>

        <ProjectStatusBadge status={project.status} className="w-fit" />
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 pt-0">
        {/* Description */}
        {project.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {project.description}
          </p>
        )}

        {/* Metadata row */}
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CheckSquare className="size-3.5" aria-hidden="true" />
            {project.taskCount} task{project.taskCount !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3.5" aria-hidden="true" />
            {project.memberCount} member{project.memberCount !== 1 ? 's' : ''}
          </span>
          {dueDate && (
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              {dueDate}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
