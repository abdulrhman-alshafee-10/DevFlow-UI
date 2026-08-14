'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { cn } from '@/lib/utils/cn';
import { TaskCard } from './task-card';
import type { Task, Status } from '@/types';

// ── Column metadata ────────────────────────────────────────────────────────

export interface ColumnConfig {
  id: Status;
  label: string;
  /** Tailwind class for the accent strip on the column header. */
  accent: string;
}

export const BOARD_COLUMNS: ColumnConfig[] = [
  { id: 'backlog', label: 'Backlog', accent: 'bg-border' },
  { id: 'todo', label: 'To Do', accent: 'bg-secondary' },
  { id: 'in_progress', label: 'In Progress', accent: 'bg-info' },
  { id: 'in_review', label: 'In Review', accent: 'bg-warning' },
  { id: 'done', label: 'Done', accent: 'bg-success' },
];

interface TaskColumnProps {
  column: ColumnConfig;
  tasks: Task[];
  assigneeMap: Record<string, { name: string; avatarUrl: string | null }>;
}

/**
 * Droppable Kanban column.
 *
 * Wraps tasks in `SortableContext` so within-column reordering works,
 * and uses `useDroppable` so cross-column drops register correctly even
 * when the column is empty.
 */
export function TaskColumn({ column, tasks, assigneeMap }: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex w-72 shrink-0 flex-col gap-0 rounded-xl border border-border bg-muted/30">
      {/* Column header */}
      <div className="flex items-center gap-2 rounded-t-xl border-b border-border bg-card px-3 py-2.5">
        <span
          className={cn('h-2.5 w-2.5 shrink-0 rounded-full', column.accent)}
          aria-hidden="true"
        />
        <h3 className="flex-1 text-sm font-semibold">{column.label}</h3>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {tasks.length}
        </span>
      </div>

      {/* Task list */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex min-h-[120px] flex-1 flex-col gap-2 rounded-b-xl p-2 transition-colors',
          isOver && 'bg-primary/5 ring-2 ring-inset ring-primary/20',
        )}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => {
            const assignee = task.assigneeId
              ? assigneeMap[task.assigneeId]
              : undefined;
            return (
              <TaskCard
                key={task.id}
                task={task}
                assigneeName={assignee?.name}
                assigneeAvatarUrl={assignee?.avatarUrl}
              />
            );
          })}
        </SortableContext>

        {tasks.length === 0 && (
          <p className="px-2 py-4 text-center text-xs text-muted-foreground">
            Drop tasks here
          </p>
        )}
      </div>
    </div>
  );
}
