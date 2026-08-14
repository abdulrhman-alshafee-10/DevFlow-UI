'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, AlignLeft, CalendarDays } from 'lucide-react';

import {
  createTaskSchema,
  type CreateTaskFormValues,
} from '@/lib/schemas/task';
import { useTasks } from '@/hooks/use-tasks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
} from '@/components/ui/modal';
import type { Priority, Status } from '@/types';

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
  'h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-background';

interface CreateTaskModalProps {
  projectId: string;
  /** Pre-fill the status column when opened from a column header. */
  defaultStatus?: 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';
  open: boolean;
  onClose: () => void;
}

/**
 * Modal for creating a new task.
 * Thin wrapper that delegates to `useTasks` and `createTaskSchema`.
 */
export function CreateTaskModal({
  projectId,
  defaultStatus = 'todo',
  open,
  onClose,
}: CreateTaskModalProps) {
  const { createTaskAsync, isCreating } = useTasks(projectId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: defaultStatus,
      priority: 'medium',
      dueDate: '',
    },
  });

  async function onSubmit(values: CreateTaskFormValues) {
    try {
      await createTaskAsync({
        title: values.title,
        description: values.description || undefined,
        status: values.status,
        priority: values.priority,
        dueDate: values.dueDate || undefined,
      });
      reset({
        title: '',
        description: '',
        status: defaultStatus,
        priority: 'medium',
        dueDate: '',
      });
      onClose();
    } catch {
      // error toast handled in hook
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          reset({
            title: '',
            description: '',
            status: defaultStatus,
            priority: 'medium',
            dueDate: '',
          });
          onClose();
        }
      }}
    >
      <ModalContent className="max-w-md">
        <ModalHeader>
          <div className="flex items-center gap-2">
            <CheckSquare
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <ModalTitle>New task</ModalTitle>
          </div>
          <ModalDescription>Add a task to this project.</ModalDescription>
        </ModalHeader>

        <form
          id="create-task-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <Input
            {...register('title')}
            label="Title"
            placeholder="What needs to be done?"
            leftIcon={<CheckSquare />}
            error={errors.title?.message}
            required
            autoFocus
          />

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-description">
              <span className="flex items-center gap-1.5">
                <AlignLeft className="size-3.5" aria-hidden="true" />
                Description
              </span>
            </Label>
            <textarea
              {...register('description')}
              id="task-description"
              placeholder="Optional details…"
              rows={2}
              className="flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
          </div>

          {/* Status + Priority row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-status">Status</Label>
              <select
                {...register('status')}
                id="task-status"
                className={SELECT_BASE}
              >
                {STATUS_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-xs text-destructive">
                  {errors.status.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-priority">Priority</Label>
              <select
                {...register('priority')}
                id="task-priority"
                className={SELECT_BASE}
              >
                {PRIORITY_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.priority && (
                <p className="text-xs text-destructive">
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          <Input
            {...register('dueDate')}
            label="Due date"
            type="date"
            leftIcon={<CalendarDays />}
            error={errors.dueDate?.message}
            helperText="Optional"
          />
        </form>

        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline" disabled={isCreating}>
              Cancel
            </Button>
          </ModalClose>
          <Button
            type="submit"
            form="create-task-form"
            isLoading={isCreating}
            loadingText="Creating…"
          >
            Create task
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
