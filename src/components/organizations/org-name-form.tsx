'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2 } from 'lucide-react';

import {
  updateOrgSchema,
  type UpdateOrgFormValues,
} from '@/lib/schemas/organization';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ApiErrorResponse } from '@/types';

interface OrgNameFormProps {
  /** Current organization name — pre-fills the input. */
  defaultName: string;
  onSave: (name: string) => void;
  isSaving?: boolean;
  /** API error — field-level errors are surfaced automatically. */
  saveError?: ApiErrorResponse | null;
}

/**
 * Card form for editing an organization's display name.
 * Shared between the create flow and the settings page.
 */
export function OrgNameForm({
  defaultName,
  onSave,
  isSaving,
  saveError,
}: OrgNameFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<UpdateOrgFormValues>({
    resolver: zodResolver(updateOrgSchema),
    defaultValues: { name: defaultName },
  });

  // Re-populate when the parent supplies a new defaultName (e.g. after load)
  useEffect(() => {
    reset({ name: defaultName });
  }, [defaultName, reset]);

  // Surface API field errors from the parent hook
  useEffect(() => {
    if (saveError?.errors?.name) {
      setError('name', { message: saveError.errors.name });
    }
  }, [saveError, setError]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <CardTitle>General</CardTitle>
        </div>
        <CardDescription>
          Update your organization&apos;s display name.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit((v) => onSave(v.name))}
          noValidate
          className="space-y-4"
        >
          <Input
            {...register('name')}
            label="Organization name"
            placeholder="Acme Inc."
            leftIcon={<Building2 />}
            error={errors.name?.message}
            required
          />
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              isLoading={isSaving}
              loadingText="Saving…"
              disabled={!isDirty}
            >
              Save changes
            </Button>
            {isDirty && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => reset()}
                disabled={isSaving}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
