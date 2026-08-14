'use client';

import { use, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PermissionGate } from '@/components/auth/permission-gate';
import { TaskListView } from '@/components/tasks/task-list-view';
import {
  TaskFilterBar,
  type TaskFilters,
} from '@/components/tasks/task-filter-bar';
import { CreateTaskModal } from '@/components/tasks/create-task-modal';
import { listMembers } from '@/lib/api/organizations';
import { useOrgStore, selectActiveOrgId } from '@/stores/org-store';

interface PageProps {
  params: Promise<{ projectId: string }>;
}

/**
 * Project List view — flat table of all tasks with filters.
 */
export default function ProjectListPage({ params }: PageProps) {
  const { projectId } = use(params);
  const [createOpen, setCreateOpen] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    priority: '',
    assigneeId: '',
  });

  const activeOrgId = useOrgStore(selectActiveOrgId);

  const { data: membersPage } = useQuery({
    queryKey: ['org', activeOrgId, 'members'],
    queryFn: () => listMembers(activeOrgId!, { pageSize: 100 }),
    enabled: Boolean(activeOrgId),
    staleTime: 5 * 60 * 1000,
  });

  const assigneeMap: Record<
    string,
    { name: string; avatarUrl: string | null }
  > = Object.fromEntries(
    (membersPage?.items ?? []).map((m) => [
      m.userId,
      { name: m.displayName, avatarUrl: m.avatarUrl },
    ]),
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <TaskFilterBar
          filters={filters}
          onChange={setFilters}
          assignees={Object.entries(assigneeMap).map(([id, a]) => ({
            id,
            name: a.name,
          }))}
        />
        <PermissionGate permission="task:create">
          <Button onClick={() => setCreateOpen(true)} size="sm">
            <Plus className="size-4" aria-hidden="true" />
            Add task
          </Button>
        </PermissionGate>
      </div>

      <TaskListView
        projectId={projectId}
        filters={filters}
        assigneeMap={assigneeMap}
      />

      <CreateTaskModal
        projectId={projectId}
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
