'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2 } from 'lucide-react';

import {
  createOrgSchema,
  type CreateOrgFormValues,
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

interface CreateOrgFormProps {
  onSubmit: (name: string) => void;
  isSubmitting?: boolean;
  /** API error — field-level errors are surfaced automatically. */
  submitError?: ApiErrorResponse | null;
  onCancel?: () => void;
}

/**
 * Standalone card form for creating a new organization.
 */
export function CreateOrgForm({
  onSubmit,
  isSubmitting,
  submitError,
  onCancel,
}: CreateOrgFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateOrgFormValues>({
    resolver: zodResolver(createOrgSchema),
  });

  useEffect(() => {
    if (submitError?.errors?.name) {
      setError('name', { message: submitError.errors.name });
    }
  }, [submitError, setError]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <CardTitle>Organization details</CardTitle>
        </div>
        <CardDescription>
          Choose a name that describes your team or company.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit((v) => onSubmit(v.name))}
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
            autoFocus
          />
          <div className="flex items-center gap-3 pt-1">
            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingText="Creating…"
            >
              Create organization
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                disabled={isSubmitting}
                onClick={onCancel}
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
