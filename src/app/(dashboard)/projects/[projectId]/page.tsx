'use client';

import { use, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PermissionGate } from '@/components/auth/permission-gate';
import { TaskBoard } from '@/components/tasks/task-board';
import {
  TaskFilterBar,
  type TaskFilters,
} from '@/components/tasks/task-filter-bar';
import { CreateTaskModal } from '@/components/tasks/create-task-modal';
import { ProjectSummarizeButton } from '@/components/ai/project-summarize-button';
import { AIAssistantPanel } from '@/components/ai/ai-assistant-panel';
import { listMembers } from '@/lib/api/organizations';
import { useOrgStore, selectActiveOrgId } from '@/stores/org-store';
import type { Priority } from '@/types';

interface PageProps {
  params: Promise<{ projectId: string }>;
}

/**
 * Project Board page — Kanban view.
 * Thin shell: state for filters + modal, delegates rendering to components.
 */
export default function ProjectBoardPage({ params }: PageProps) {
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
        <div className="flex items-center gap-2">
          <ProjectSummarizeButton projectId={projectId} />
          <PermissionGate permission="task:create">
            <Button onClick={() => setCreateOpen(true)} size="sm">
              <Plus className="size-4" aria-hidden="true" />
              Add task
            </Button>
          </PermissionGate>
        </div>
      </div>

      <TaskBoard
        projectId={projectId}
        filters={{
          search: filters.search || undefined,
          priority: (filters.priority as Priority) || undefined,
          assigneeId: filters.assigneeId || undefined,
        }}
        assigneeMap={assigneeMap}
      />

      {/* AI assistant — collapsible, scoped to this project */}
      <AIAssistantPanel
        context={{ type: 'project', id: projectId, label: 'This project' }}
      />

      <CreateTaskModal
        projectId={projectId}
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
