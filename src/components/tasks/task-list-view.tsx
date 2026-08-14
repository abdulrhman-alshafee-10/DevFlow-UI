'use client';

import { CalendarDays } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/spinner';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { useTasks } from '@/hooks/use-tasks';
import type { Task, Status } from '@/types';
import type { TaskFilters } from './task-filter-bar';

const STATUS_LABEL: Record<Status, string> = {
  backlog: 'Backlog',
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done',
  archived: 'Archived',
};

interface AssigneeInfo {
  name: string;
  avatarUrl: string | null;
}

interface TaskListViewProps {
  projectId: string;
  filters: TaskFilters;
  assigneeMap: Record<string, AssigneeInfo>;
}

/**
 * Flat table view of all tasks in a project.
 * Shares `useTasks` with `TaskBoard` so the same cache is used.
 */
export function TaskListView({
  projectId,
  filters,
  assigneeMap,
}: TaskListViewProps) {
  const { tasks, isLoading, error } = useTasks(projectId, {
    search: filters.search || undefined,
    priority: filters.priority || undefined,
    assigneeId: filters.assigneeId || undefined,
  });

  if (error && !isLoading) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        Failed to load tasks — {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner label="Loading tasks" />
      </div>
    );
  }

  const columns: DataTableColumn<Task>[] = [
    {
      key: 'title',
      header: 'Title',
      cell: (row) => (
        <p className="line-clamp-1 text-sm font-medium">{row.title}</p>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      className: 'w-32 hidden sm:table-cell',
      cell: (row) => (
        <Badge status={row.status}>{STATUS_LABEL[row.status]}</Badge>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      className: 'w-28 hidden sm:table-cell',
      cell: (row) => <Badge priority={row.priority}>{row.priority}</Badge>,
    },
    {
      key: 'assignee',
      header: 'Assignee',
      className: 'w-40 hidden md:table-cell',
      cell: (row) => {
        const assignee = row.assigneeId ? assigneeMap[row.assigneeId] : null;
        if (!assignee)
          return (
            <span className="text-xs text-muted-foreground">Unassigned</span>
          );
        return (
          <div className="flex items-center gap-2">
            <Avatar
              src={assignee.avatarUrl ?? undefined}
              name={assignee.name}
              size="xs"
            />
            <span className="truncate text-sm">{assignee.name}</span>
          </div>
        );
      },
    },
    {
      key: 'dueDate',
      header: 'Due',
      className: 'w-28 hidden lg:table-cell',
      cell: (row) => {
        if (!row.dueDate)
          return <span className="text-xs text-muted-foreground">—</span>;
        const isOverdue = new Date(row.dueDate) < new Date();
        return (
          <span
            className={`flex items-center gap-1 text-xs ${isOverdue ? 'font-medium text-destructive' : 'text-muted-foreground'}`}
          >
            <CalendarDays className="size-3" aria-hidden="true" />
            {new Date(row.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        );
      },
    },
  ];

  // Apply client-side filtering (search / priority / assignee) if backend
  // doesn't support all params yet
  const filtered = tasks.filter((t) => {
    if (
      filters.search &&
      !t.title.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    if (filters.priority && t.priority !== filters.priority) return false;
    if (filters.assigneeId && t.assigneeId !== filters.assigneeId) return false;
    return true;
  });

  return (
    <DataTable
      columns={columns}
      data={filtered}
      rowKey={(row) => row.id}
      emptyMessage="No tasks match your filters."
    />
  );
}
