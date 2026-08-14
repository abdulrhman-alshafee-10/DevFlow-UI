'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';

import { useTasks } from '@/hooks/use-tasks';
import { TaskColumn, BOARD_COLUMNS } from './task-column';
import { TaskCard } from './task-card';
import { Spinner } from '@/components/ui/spinner';
import type { Task, Status, Priority } from '@/types';

interface AssigneeInfo {
  name: string;
  avatarUrl: string | null;
}

interface TaskBoardProps {
  projectId: string;
  filters: { assigneeId?: string; priority?: Priority; search?: string };
  /** Map of userId → display info for rendering assignee chips. */
  assigneeMap: Record<string, AssigneeInfo>;
}

/**
 * Kanban board orchestrator.
 *
 * Owns DndContext, drag state, and the optimistic move logic.
 * Columns and cards are rendered by TaskColumn / TaskCard.
 */
export function TaskBoard({ projectId, filters, assigneeMap }: TaskBoardProps) {
  const { tasks, isLoading, error, moveTask } = useTasks(projectId, filters);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  // Local shadow copy to drive optimistic column changes during drag
  const [localTasks, setLocalTasks] = useState<Task[] | null>(null);

  const displayTasks = localTasks ?? tasks;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const getTasksByStatus = useCallback(
    (status: Status) =>
      displayTasks
        .filter((t) => t.status === status)
        .sort((a, b) => a.position - b.position),
    [displayTasks],
  );

  // ── Drag start ─────────────────────────────────────────────────────────
  function handleDragStart({ active }: DragStartEvent) {
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
      setLocalTasks([...tasks]); // snapshot before any changes
    }
  }

  // ── Drag over — update column membership while dragging ────────────────
  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over || !localTasks) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = localTasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // `over` can be a column id (Status) or another task id
    const overStatus = BOARD_COLUMNS.find((c) => c.id === overId)?.id as
      Status | undefined;
    const overTask = localTasks.find((t) => t.id === overId);
    const targetStatus: Status =
      overStatus ?? overTask?.status ?? activeTask.status;

    if (targetStatus === activeTask.status) return;

    setLocalTasks((prev) =>
      (prev ?? []).map((t) =>
        t.id === activeId ? { ...t, status: targetStatus } : t,
      ),
    );
  }

  // ── Drag end — commit the move ─────────────────────────────────────────
  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveTask(null);

    if (!over || !localTasks) {
      setLocalTasks(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = localTasks.find((t) => t.id === activeId);
    if (!activeTask) {
      setLocalTasks(null);
      return;
    }

    // Determine final status
    const overColumn = BOARD_COLUMNS.find((c) => c.id === overId);
    const overTask = localTasks.find((t) => t.id === overId);
    const newStatus: Status =
      overColumn?.id ?? overTask?.status ?? activeTask.status;

    // Calculate new position within the target column
    const columnTasks = localTasks
      .filter((t) => t.status === newStatus)
      .sort((a, b) => a.position - b.position);

    let newPosition: number;
    if (activeTask.status === newStatus && overTask) {
      // Reordering within same column
      const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
      const newIndex = columnTasks.findIndex((t) => t.id === overId);
      const reordered = arrayMove(columnTasks, oldIndex, newIndex);
      newPosition = reordered.findIndex((t) => t.id === activeId) + 1;
    } else {
      // Moving to new column — append at end
      newPosition = columnTasks.length + 1;
    }

    setLocalTasks(null); // revert to server data; mutation will update it

    moveTask({
      taskId: activeId,
      payload: { status: newStatus, position: newPosition },
    });
  }

  // ── Render ─────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner label="Loading tasks" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        Failed to load tasks — {error.message}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 overflow-x-auto pb-4">
        {BOARD_COLUMNS.map((column) => (
          <TaskColumn
            key={column.id}
            column={column}
            tasks={getTasksByStatus(column.id)}
            assigneeMap={assigneeMap}
          />
        ))}
      </div>

      {/* Floating drag overlay — renders the card being dragged */}
      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="rotate-2 opacity-95">
            <TaskCard
              task={activeTask}
              assigneeName={
                activeTask.assigneeId
                  ? assigneeMap[activeTask.assigneeId]?.name
                  : undefined
              }
              assigneeAvatarUrl={
                activeTask.assigneeId
                  ? assigneeMap[activeTask.assigneeId]?.avatarUrl
                  : undefined
              }
              disabled
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
