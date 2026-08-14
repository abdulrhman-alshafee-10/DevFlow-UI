import { z } from 'zod';

// ── Shared field rules ─────────────────────────────────────────────────────

const nameField = z
  .string()
  .min(2, 'Project name must be at least 2 characters')
  .max(100, 'Project name must be 100 characters or fewer');

const descriptionField = z
  .string()
  .max(500, 'Description must be 500 characters or fewer')
  .optional();

const dueDateField = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date (YYYY-MM-DD)')
  .optional()
  .or(z.literal(''));

// ── Create project ─────────────────────────────────────────────────────────

export const createProjectSchema = z.object({
  name: nameField,
  description: descriptionField,
  dueDate: dueDateField,
});

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

// ── Update project ─────────────────────────────────────────────────────────

export const updateProjectSchema = z.object({
  name: nameField,
  description: descriptionField,
  dueDate: dueDateField,
  status: z.enum(['active', 'archived', 'completed']).optional(),
});

export type UpdateProjectFormValues = z.infer<typeof updateProjectSchema>;
