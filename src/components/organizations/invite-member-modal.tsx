'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, UserCog } from 'lucide-react';

import {
  inviteMemberSchema,
  type InviteMemberFormValues,
} from '@/lib/schemas/organization';
import { useOrgMembers } from '@/hooks/use-organizations';
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
import type { ApiErrorResponse } from '@/types';

const ROLE_OPTIONS = [
  {
    value: 'admin',
    label: 'Admin',
    description: 'Can manage projects and members',
  },
  {
    value: 'member',
    label: 'Member',
    description: 'Can create and edit tasks',
  },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access' },
] as const;

interface InviteMemberModalProps {
  orgId: string;
  open: boolean;
  onClose: () => void;
}

/**
 * Modal form for inviting a new member to an organization.
 */
export function InviteMemberModal({
  orgId,
  open,
  onClose,
}: InviteMemberModalProps) {
  const { inviteMember, isInviting } = useOrgMembers(orgId);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InviteMemberFormValues>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { role: 'member' },
  });

  const selectedRole = watch('role');

  // Reset form whenever the modal opens
  useEffect(() => {
    if (open) reset({ role: 'member' });
  }, [open, reset]);

  function onSubmit(values: InviteMemberFormValues) {
    inviteMember(
      { email: values.email, role: values.role },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err: ApiErrorResponse) => {
          if (err.errors?.email) {
            setError('email', { message: err.errors.email });
          }
        },
      },
    );
  }

  return (
    <Modal open={open} onOpenChange={(o) => !o && onClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Invite a member</ModalTitle>
          <ModalDescription>
            Send an email invitation to add someone to this organization.
          </ModalDescription>
        </ModalHeader>

        <form
          id="invite-member-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          {/* Email */}
          <Input
            {...register('email')}
            label="Email address"
            type="email"
            autoComplete="off"
            placeholder="colleague@example.com"
            leftIcon={<Mail />}
            error={errors.email?.message}
            required
          />

          {/* Role selection */}
          <div className="space-y-2">
            <Label required>
              <span className="flex items-center gap-1.5">
                <UserCog className="size-3.5" aria-hidden="true" />
                Role
              </span>
            </Label>
            <div className="grid gap-2">
              {ROLE_OPTIONS.map(({ value, label, description }) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                    selectedRole === value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <input
                    type="radio"
                    value={value}
                    checked={selectedRole === value}
                    onChange={() => setValue('role', value)}
                    className="mt-0.5 accent-primary"
                    aria-describedby={`role-desc-${value}`}
                  />
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p
                      id={`role-desc-${value}`}
                      className="text-xs text-muted-foreground"
                    >
                      {description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            {errors.role && (
              <p className="text-xs font-medium text-destructive">
                {errors.role.message}
              </p>
            )}
          </div>
        </form>

        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline" disabled={isInviting}>
              Cancel
            </Button>
          </ModalClose>
          <Button
            type="submit"
            form="invite-member-form"
            isLoading={isInviting}
            loadingText="Sending…"
          >
            Send invitation
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
