import { Clock } from 'lucide-react';

import { Avatar } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/spinner';
import type { TaskHistoryEntry } from '@/lib/api/tasks';

interface TaskHistoryTimelineProps {
  entries: TaskHistoryEntry[];
  isLoading?: boolean;
}

/** Human-readable label for a changed field name. */
function fieldLabel(field: string): string {
  const map: Record<string, string> = {
    title: 'title',
    description: 'description',
    status: 'status',
    priority: 'priority',
    assigneeId: 'assignee',
    dueDate: 'due date',
    position: 'position',
  };
  return map[field] ?? field;
}

function formatValue(value: string | null): string {
  if (!value) return '—';
  // Convert snake_case statuses to readable form
  return value.replace(/_/g, ' ');
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

/**
 * Vertical timeline of task audit log entries.
 * Each entry shows who changed what field, from what value to what value.
 */
export function TaskHistoryTimeline({
  entries,
  isLoading,
}: TaskHistoryTimelineProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Spinner label="Loading history" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <p className="py-6 text-center text-xs text-muted-foreground">
        No activity yet.
      </p>
    );
  }

  return (
    <ol
      className="relative border-l border-border pl-5"
      aria-label="Task history"
    >
      {entries.map((entry, i) => (
        <li key={entry.id} className="mb-5 ml-1 last:mb-0">
          {/* Timeline dot */}
          <span
            aria-hidden="true"
            className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-background bg-border"
          />

          <div className="flex items-start gap-2">
            <Avatar
              src={entry.userAvatarUrl ?? undefined}
              name={entry.userDisplayName}
              size="xs"
              className="mt-0.5 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs leading-snug">
                <span className="font-medium">{entry.userDisplayName}</span>
                {' changed '}
                <span className="font-medium">{fieldLabel(entry.field)}</span>
                {entry.oldValue !== null && (
                  <>
                    {' from '}
                    <span className="rounded bg-muted px-1 font-mono text-[10px]">
                      {formatValue(entry.oldValue)}
                    </span>
                  </>
                )}
                {' to '}
                <span className="rounded bg-muted px-1 font-mono text-[10px]">
                  {formatValue(entry.newValue)}
                </span>
              </p>
              <time
                dateTime={entry.createdAt}
                className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground"
              >
                <Clock className="size-2.5" aria-hidden="true" />
                {timeAgo(entry.createdAt)}
              </time>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
