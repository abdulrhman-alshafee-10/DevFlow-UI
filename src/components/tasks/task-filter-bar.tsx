'use client';

import { Search, X } from 'lucide-react';
import { useId } from 'react';

import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { Priority } from '@/types';

const PRIORITY_OPTIONS: { value: Priority | ''; label: string }[] = [
  { value: '', label: 'All priorities' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export interface TaskFilters {
  search: string;
  priority: Priority | '';
  assigneeId: string;
}

interface TaskFilterBarProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
  /** Available assignees for the dropdown. */
  assignees: { id: string; name: string }[];
}

const SELECT_BASE =
  'h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-background ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

/**
 * Filter bar rendered above the task board and list view.
 * Controlled — all state lives in the parent page.
 */
export function TaskFilterBar({
  filters,
  onChange,
  assignees,
}: TaskFilterBarProps) {
  const searchId = useId();
  const priorityId = useId();
  const assigneeId = useId();

  const hasActiveFilters =
    filters.search || filters.priority || filters.assigneeId;

  return (
    <div className="flex flex-wrap items-end gap-3">
      {/* Search */}
      <div className="flex min-w-[180px] flex-1 flex-col gap-1.5">
        <Label htmlFor={searchId} className="sr-only">
          Search tasks
        </Label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute inset-y-0 left-3 my-auto size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id={searchId}
            type="search"
            placeholder="Search tasks…"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className={cn(SELECT_BASE, 'w-full pl-9')}
          />
        </div>
      </div>

      {/* Priority filter */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={priorityId} className="sr-only">
          Filter by priority
        </Label>
        <select
          id={priorityId}
          value={filters.priority}
          onChange={(e) =>
            onChange({ ...filters, priority: e.target.value as Priority | '' })
          }
          className={SELECT_BASE}
          aria-label="Filter by priority"
        >
          {PRIORITY_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Assignee filter */}
      {assignees.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={assigneeId} className="sr-only">
            Filter by assignee
          </Label>
          <select
            id={assigneeId}
            value={filters.assigneeId}
            onChange={(e) =>
              onChange({ ...filters, assigneeId: e.target.value })
            }
            className={SELECT_BASE}
            aria-label="Filter by assignee"
          >
            <option value="">All assignees</option>
            {assignees.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Clear all */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange({ search: '', priority: '', assigneeId: '' })}
          aria-label="Clear all filters"
        >
          <X className="size-3.5" aria-hidden="true" />
          Clear
        </Button>
      )}
    </div>
  );
}
