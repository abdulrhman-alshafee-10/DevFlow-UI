'use client';

import { CalendarDays, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import type { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  /** Assignee display name — resolved by the parent from the members list. */
  assigneeName?: string;
  assigneeAvatarUrl?: string | null;
  /** Disable drag handles (e.g. inside a read-only view). */
  disabled?: boolean;
}

function formatDueDate(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  const diff = Math.round((date.getTime() - today.getTime()) / 86_400_000);
  if (diff < 0) return 'Overdue';
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Draggable task card used inside `TaskColumn`.
 *
 * Uses `useSortable` from @dnd-kit/sortable so it participates in both
 * within-column reordering and cross-column drops.
 */
export function TaskCard({
  task,
  assigneeName,
  assigneeAvatarUrl,
  disabled,
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOptimistic = task.id.startsWith('optimistic-');

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex gap-2 rounded-lg border border-border bg-card p-3 shadow-soft',
        'transition-shadow hover:shadow-md',
        isDragging && 'opacity-50 shadow-xl ring-2 ring-primary/40',
        isOptimistic && 'animate-pulse opacity-60',
      )}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        type="button"
        aria-label="Drag to reorder"
        className={cn(
          'mt-0.5 shrink-0 cursor-grab touch-none text-muted-foreground',
          'opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100',
          disabled && 'hidden',
        )}
      >
        <GripVertical className="size-4" aria-hidden="true" />
      </button>

      {/* Card body */}
      <div className="min-w-0 flex-1 space-y-2">
        <p className="line-clamp-2 text-sm font-medium leading-snug">
          {task.title}
        </p>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge priority={task.priority}>{task.priority}</Badge>

          {task.dueDate && (
            <span
              className={cn(
                'flex items-center gap-1 text-xs',
                new Date(task.dueDate) < new Date()
                  ? 'font-medium text-destructive'
                  : 'text-muted-foreground',
              )}
            >
              <CalendarDays className="size-3" aria-hidden="true" />
              {formatDueDate(task.dueDate)}
            </span>
          )}
        </div>

        {assigneeName && (
          <div className="flex items-center gap-1.5">
            <Avatar
              src={assigneeAvatarUrl ?? undefined}
              name={assigneeName}
              size="xs"
            />
            <span className="truncate text-xs text-muted-foreground">
              {assigneeName}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
