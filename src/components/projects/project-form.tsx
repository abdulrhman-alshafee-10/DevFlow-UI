'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FolderKanban, AlignLeft, CalendarDays } from 'lucide-react';

import {
  updateProjectSchema,
  type UpdateProjectFormValues,
} from '@/lib/schemas/project';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { ApiErrorResponse, ProjectStatus } from '@/types';

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
];

interface ProjectFormProps {
  /** Pre-fill values when editing an existing project. */
  defaultValues?: Partial<UpdateProjectFormValues>;
  onSave: (values: UpdateProjectFormValues) => void;
  isSaving?: boolean;
  saveError?: ApiErrorResponse | null;
  /** Show status field (only relevant on edit, not create). */
  showStatus?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}

/**
 * Shared form fields for both creating and editing a project.
 * The parent decides which fields to show and handles submission.
 */
export function ProjectForm({
  defaultValues,
  onSave,
  isSaving,
  saveError,
  showStatus = false,
  submitLabel = 'Save changes',
  onCancel,
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<UpdateProjectFormValues>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      dueDate: '',
      status: 'active',
      ...defaultValues,
    },
  });

  // Re-sync when parent provides new defaultValues (e.g. after data loads)
  useEffect(() => {
    if (defaultValues)
      reset({
        name: '',
        description: '',
        dueDate: '',
        status: 'active',
        ...defaultValues,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues?.name]);

  // Surface API field errors
  useEffect(() => {
    if (saveError?.errors?.name)
      setError('name', { message: saveError.errors.name });
    if (saveError?.errors?.description)
      setError('description', { message: saveError.errors.description });
    if (saveError?.errors?.dueDate)
      setError('dueDate', { message: saveError.errors.dueDate });
  }, [saveError, setError]);

  return (
    <form onSubmit={handleSubmit(onSave)} noValidate className="space-y-4">
      <Input
        {...register('name')}
        label="Project name"
        placeholder="My awesome project"
        leftIcon={<FolderKanban />}
        error={errors.name?.message}
        required
      />

      {/* Description — plain textarea with label wrapper */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="project-description">
          <span className="flex items-center gap-1.5">
            <AlignLeft className="size-3.5" aria-hidden="true" />
            Description
          </span>
        </Label>
        <textarea
          {...register('description')}
          id="project-description"
          placeholder="What is this project about?"
          rows={3}
          className="flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
          aria-invalid={errors.description ? true : undefined}
        />
        {errors.description && (
          <p className="text-xs font-medium text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <Input
        {...register('dueDate')}
        label="Due date"
        type="date"
        leftIcon={<CalendarDays />}
        error={errors.dueDate?.message}
        helperText="Optional — leave blank for no deadline"
      />

      {showStatus && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="project-status">Status</Label>
          <select
            {...register('status')}
            id="project-status"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            {STATUS_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="text-xs font-medium text-destructive">
              {errors.status.message}
            </p>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 pt-1">
        <Button
          type="submit"
          isLoading={isSaving}
          loadingText="Saving…"
          disabled={!isDirty}
        >
          {submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            disabled={isSaving}
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
