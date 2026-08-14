'use client';

import { CalendarDays, User, Tag, CircleDot } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import type { Task, Status, Priority } from '@/types';
import type { UpdateTaskPayload } from '@/lib/api/tasks';

// ── Option sets ────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'in_review', label: 'In Review' },
  { value: 'done', label: 'Done' },
];

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const SELECT_BASE =
  'h-8 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' +
  'focus-visible:ring-offset-1 focus-visible:ring-offset-background';

interface AssigneeInfo {
  name: string;
  avatarUrl: string | null;
}

interface TaskMetaSidebarProps {
  task: Task;
  onUpdate: (payload: UpdateTaskPayload) => void;
  isUpdating?: boolean;
  assigneeMap?: Record<string, AssigneeInfo>;
}

/**
 * Right-side metadata panel inside the task detail view.
 * Each field is a small select/input that fires `onUpdate` on change.
 */
export function TaskMetaSidebar({
  task,
  onUpdate,
  isUpdating,
  assigneeMap = {},
}: TaskMetaSidebarProps) {
  const assignee = task.assigneeId ? assigneeMap[task.assigneeId] : null;

  return (
    <div className="flex flex-col gap-4 text-sm">
      {/* Status */}
      <div className="space-y-1">
        <Label className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CircleDot className="size-3" aria-hidden="true" />
          Status
        </Label>
        <select
          value={task.status}
          disabled={isUpdating}
          onChange={(e) => onUpdate({ status: e.target.value as Status })}
          className={SELECT_BASE}
          aria-label="Task status"
        >
          {STATUS_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Priority */}
      <div className="space-y-1">
        <Label className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Tag className="size-3" aria-hidden="true" />
          Priority
        </Label>
        <select
          value={task.priority}
          disabled={isUpdating}
          onChange={(e) => onUpdate({ priority: e.target.value as Priority })}
          className={SELECT_BASE}
          aria-label="Task priority"
        >
          {PRIORITY_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Assignee */}
      <div className="space-y-1">
        <Label className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="size-3" aria-hidden="true" />
          Assignee
        </Label>
        {assignee ? (
          <div className="flex items-center gap-2 rounded-md border border-border px-2 py-1">
            <Avatar
              src={assignee.avatarUrl ?? undefined}
              name={assignee.name}
              size="xs"
            />
            <span className="truncate text-xs">{assignee.name}</span>
          </div>
        ) : (
          <p className="px-2 py-1 text-xs italic text-muted-foreground">
            Unassigned
          </p>
        )}
      </div>

      {/* Due date */}
      <div className="space-y-1">
        <Label className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="size-3" aria-hidden="true" />
          Due date
        </Label>
        <input
          type="date"
          value={task.dueDate ?? ''}
          disabled={isUpdating}
          onChange={(e) => onUpdate({ dueDate: e.target.value || null })}
          className={SELECT_BASE}
          aria-label="Task due date"
        />
      </div>

      {/* Badges summary */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        <Badge status={task.status}>{task.status.replace('_', ' ')}</Badge>
        <Badge priority={task.priority}>{task.priority}</Badge>
      </div>
    </div>
  );
}
