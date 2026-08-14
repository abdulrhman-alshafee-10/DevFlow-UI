import { z } from 'zod';
import type { Status, Priority } from '@/types';

const STATUSES = [
  'backlog',
  'todo',
  'in_progress',
  'in_review',
  'done',
] as const satisfies readonly Status[];
const PRIORITIES = [
  'low',
  'medium',
  'high',
  'urgent',
] as const satisfies readonly Priority[];

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or fewer'),
  description: z
    .string()
    .max(2000, 'Description must be 2000 characters or fewer')
    .optional(),
  status: z.enum(STATUSES),
  priority: z.enum(PRIORITIES),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date (YYYY-MM-DD)')
    .optional()
    .or(z.literal('')),
});

export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;
