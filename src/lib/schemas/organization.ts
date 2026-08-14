import { z } from 'zod';

// ── Create / update organization ───────────────────────────────────────────

export const createOrgSchema = z.object({
  name: z
    .string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(80, 'Organization name must be 80 characters or fewer'),
});

export type CreateOrgFormValues = z.infer<typeof createOrgSchema>;

export const updateOrgSchema = createOrgSchema;
export type UpdateOrgFormValues = z.infer<typeof updateOrgSchema>;

// ── Invite member ──────────────────────────────────────────────────────────

export const inviteMemberSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  role: z.enum(['admin', 'member', 'viewer'], {
    error: 'Please select a valid role',
  }),
});

export type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>;
