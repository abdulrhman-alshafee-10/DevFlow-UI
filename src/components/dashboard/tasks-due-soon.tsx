import { CalendarClock, AlertCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import type { TaskDueSoon } from '@/lib/api/users';
import type { Priority } from '@/types';

interface TasksDueSoonProps {
  tasks: TaskDueSoon[] | undefined;
  isLoading: boolean;
  hasError: boolean;
}

function formatDueDate(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diffMs = date.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  return `Due in ${diffDays} days`;
}

function isDueSoon(iso: string): boolean {
  const date = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  const diffDays = Math.round(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diffDays <= 0;
}

/**
 * Widget listing tasks with upcoming due dates.
 */
export function TasksDueSoon({
  tasks,
  isLoading,
  hasError,
}: TasksDueSoonProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CalendarClock
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <CardTitle>Tasks Due Soon</CardTitle>
        </div>
        <CardDescription>Your most time-sensitive open tasks</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Spinner label="Loading tasks" />
          </div>
        )}

        {hasError && !isLoading && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
            Failed to load tasks. Pull down to retry.
          </div>
        )}

        {!isLoading && !hasError && tasks?.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No tasks due in the next 7 days 🎉
          </p>
        )}

        {!isLoading && !hasError && tasks && tasks.length > 0 && (
          <ul className="divide-y divide-border" role="list">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{task.title}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {task.projectName}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <Badge priority={task.priority as Priority}>
                    {task.priority}
                  </Badge>
                  <span
                    className={`text-xs ${
                      isDueSoon(task.dueDate)
                        ? 'font-medium text-destructive'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {formatDueDate(task.dueDate)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
