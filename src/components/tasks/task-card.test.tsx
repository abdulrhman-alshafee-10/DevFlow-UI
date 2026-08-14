/**
 * Component tests for `<TaskCard />`.
 *
 * The component uses @dnd-kit/sortable which requires a DndContext wrapper.
 * We provide a minimal wrapper rather than mocking dnd-kit so the real
 * drag hook runs without errors.
 *
 * Covers: title rendering, priority badge, due-date formatting, assignee
 * display, optimistic loading state, and disabled drag handle.
 */
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Task } from '@/types';

import { TaskCard } from './task-card';

// ── Helpers ───────────────────────────────────────────────────────────────

function today(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  // zero out time so formatDueDate sees a clean date
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
}

const baseTask: Task = {
  id: 'task-1',
  projectId: 'proj-1',
  title: 'Fix login bug',
  description: 'Users cannot log in with Google.',
  status: 'in_progress',
  priority: 'high',
  assigneeId: 'user-1',
  dueDate: null,
  position: 0,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

interface RenderCardOptions {
  taskOverrides?: Partial<Task>;
  assigneeName?: string;
  assigneeAvatarUrl?: string | null;
  disabled?: boolean;
}

/**
 * Wrap the card in the minimal DndKit providers required by useSortable.
 */
function renderCard(options: RenderCardOptions = {}) {
  const { taskOverrides, ...rest } = options;
  const task = { ...baseTask, ...taskOverrides };
  return render(
    <DndContext>
      <SortableContext items={[task.id]}>
        <TaskCard task={task} {...rest} />
      </SortableContext>
    </DndContext>,
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────

describe('<TaskCard />', () => {
  it('renders the task title', () => {
    renderCard();
    expect(screen.getByText('Fix login bug')).toBeInTheDocument();
  });

  it('title is a link to the task detail route', () => {
    renderCard();
    const link = screen.getByRole('link', { name: /fix login bug/i });
    expect(link).toHaveAttribute(
      'href',
      `/projects/${baseTask.projectId}/tasks/${baseTask.id}`,
    );
  });

  it('renders a priority badge with the task priority', () => {
    renderCard();
    // Badge renders the priority text as its label
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('renders no due-date indicator when dueDate is null', () => {
    renderCard();
    expect(screen.queryByText('Today')).not.toBeInTheDocument();
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  it('shows "Today" when dueDate is today', () => {
    renderCard({ taskOverrides: { dueDate: today(0) } });
    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('shows "Tomorrow" when dueDate is tomorrow', () => {
    renderCard({ taskOverrides: { dueDate: today(1) } });
    expect(screen.getByText('Tomorrow')).toBeInTheDocument();
  });

  it('shows "Overdue" when dueDate is in the past', () => {
    renderCard({ taskOverrides: { dueDate: today(-3) } });
    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });

  it('renders assignee name when provided', () => {
    renderCard({ assigneeName: 'Jane Doe' });
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('does not render assignee section when assigneeName is omitted', () => {
    renderCard();
    expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
  });

  it('renders the drag-handle button when not disabled', () => {
    renderCard({ disabled: false });
    expect(
      screen.getByRole('button', { name: /drag to reorder/i }),
    ).toBeInTheDocument();
  });

  it('hides the drag-handle button when disabled', () => {
    renderCard({ disabled: true });
    const handle = screen.queryByRole('button', { name: /drag to reorder/i });
    // Button is rendered with class "hidden" when disabled
    if (handle) {
      expect(handle).toHaveClass('hidden');
    } else {
      // Some versions may not render it at all
      expect(handle).not.toBeInTheDocument();
    }
  });

  it('applies animate-pulse class for optimistic tasks', () => {
    renderCard({
      taskOverrides: { id: 'optimistic-abc123', title: 'Fix login bug' },
    });
    // The root wrapper div should contain the animate-pulse class
    const cardRoot = document.querySelector('[class*="animate-pulse"]');
    expect(cardRoot).toBeTruthy();
  });

  it('does not apply animate-pulse for regular tasks', () => {
    renderCard();
    const cardRoot = document.querySelector('[class*="animate-pulse"]');
    expect(cardRoot).toBeNull();
  });
});
