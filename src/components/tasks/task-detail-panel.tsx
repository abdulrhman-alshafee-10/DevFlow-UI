'use client';

import { AlignLeft, History } from 'lucide-react';

import { Spinner } from '@/components/ui/spinner';
import { useTaskDetail } from '@/hooks/use-task-detail';
import { useTasks } from '@/hooks/use-tasks';
import { InlineEditField } from './inline-edit-field';
import { TaskMetaSidebar } from './task-meta-sidebar';
import { TaskHistoryTimeline } from './task-history-timeline';
import { CommentThread } from '@/components/comments/comment-thread';
import { FileUploadZone } from '@/components/files/file-upload-zone';
import { TaskAnalyzeButton } from '@/components/ai/task-analyze-button';
import { SuggestSubtasksButton } from '@/components/ai/suggest-subtasks-button';
import { AIAssistantPanel } from '@/components/ai/ai-assistant-panel';
import type { Priority } from '@/types';

interface AssigneeInfo {
  name: string;
  avatarUrl: string | null;
}

interface TaskDetailPanelProps {
  taskId: string;
  assigneeMap?: Record<string, AssigneeInfo>;
}

/**
 * Full task detail layout — title, description, meta sidebar, and history.
 *
 * Shared between the intercepting-route modal (`@modal`) and the
 * standalone `/tasks/[taskId]` page so both are always in sync.
 */
export function TaskDetailPanel({
  taskId,
  assigneeMap = {},
}: TaskDetailPanelProps) {
  const {
    task,
    isLoading,
    error,
    history,
    isLoadingHistory,
    updateTask,
    isUpdating,
  } = useTaskDetail(taskId);

  // Used by SuggestSubtasksButton to create subtasks in the same project
  const { createTaskAsync } = useTasks(task?.projectId ?? '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner label="Loading task" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {error?.message ?? 'Task not found.'}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="min-w-0 flex-1 space-y-5">
        {/* Title — inline editable */}
        <InlineEditField
          value={task.title}
          onSave={(title) => updateTask({ title })}
          disabled={isUpdating}
          label="Task title"
          renderDisplay={(v) => (
            <h2 className="text-xl font-bold leading-tight">{v}</h2>
          )}
        />

        {/* Description — inline editable textarea */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <AlignLeft className="size-3.5" aria-hidden="true" />
            Description
          </div>
          <InlineEditField
            value={task.description ?? ''}
            onSave={(description) => updateTask({ description })}
            multiline
            disabled={isUpdating}
            label="Task description"
            placeholder="Add a description…"
            renderDisplay={(v) => (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {v || (
                  <span className="italic text-muted-foreground">
                    No description — click to add one.
                  </span>
                )}
              </p>
            )}
          />
        </div>

        {/* ── AI tools ───────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 border-t border-border pt-4">
          <TaskAnalyzeButton taskId={taskId} />
          <SuggestSubtasksButton
            taskId={taskId}
            projectId={task.projectId}
            onCreateSubtask={({ title, description, priority }) =>
              createTaskAsync({
                title,
                description,
                priority: priority as Priority,
                status: 'todo',
              }).then(() => undefined)
            }
          />
        </div>

        {/* ── Ask AI ─────────────────────────────────────────────────── */}
        <AIAssistantPanel
          context={{ type: 'task', id: taskId, label: task.title }}
        />

        {/* ── Activity / History ─────────────────────────────────────── */}
        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <History className="size-3.5" aria-hidden="true" />
            Activity
          </div>
          <TaskHistoryTimeline entries={history} isLoading={isLoadingHistory} />
        </div>

        {/* ── Attachments ────────────────────────────────────────────── */}
        <div className="border-t border-border pt-5">
          <FileUploadZone taskId={taskId} />
        </div>

        {/* ── Comments ───────────────────────────────────────────────── */}
        <div className="border-t border-border pt-5">
          <CommentThread taskId={taskId} />
        </div>
      </div>

      {/* ── Right sidebar ─────────────────────────────────────────────── */}
      <aside className="w-full shrink-0 space-y-1 lg:w-52">
        <TaskMetaSidebar
          task={task}
          onUpdate={updateTask}
          isUpdating={isUpdating}
          assigneeMap={assigneeMap}
        />
      </aside>
    </div>
  );
}
