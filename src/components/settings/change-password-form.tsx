'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '@/lib/schemas/user';
import { useUser } from '@/hooks/use-user';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

/**
 * Security → Change password section.
 *
 * Requires the user to enter their current password first, preventing
 * unauthorized changes from an unattended session.
 */
export function ChangePasswordForm() {
  const { changePassword, isChangingPassword, changePasswordError } = useUser();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  // Surface API field-level errors
  useEffect(() => {
    if (changePasswordError?.errors?.currentPassword) {
      setError('currentPassword', {
        message: changePasswordError.errors.currentPassword,
      });
    }
    if (changePasswordError?.errors?.newPassword) {
      setError('newPassword', {
        message: changePasswordError.errors.newPassword,
      });
    }
  }, [changePasswordError, setError]);

  function onSubmit(values: ChangePasswordFormValues) {
    changePassword(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
      {
        onSuccess: () => {
          reset();
          setShowCurrent(false);
          setShowNew(false);
          setShowConfirm(false);
        },
      },
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldCheck
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <CardTitle>Change password</CardTitle>
        </div>
        <CardDescription>
          Use a strong password with at least 8 characters. We recommend a mix
          of letters, numbers, and symbols.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <Input
            {...register('currentPassword')}
            label="Current password"
            type={showCurrent ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            leftIcon={<Lock />}
            rightIcon={
              <button
                type="button"
                aria-label={showCurrent ? 'Hide password' : 'Show password'}
                onClick={() => setShowCurrent((v) => !v)}
                className="pointer-events-auto text-muted-foreground hover:text-foreground"
              >
                {showCurrent ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            }
            error={errors.currentPassword?.message}
            required
          />

          <Input
            {...register('newPassword')}
            label="New password"
            type={showNew ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            leftIcon={<Lock />}
            rightIcon={
              <button
                type="button"
                aria-label={showNew ? 'Hide password' : 'Show password'}
                onClick={() => setShowNew((v) => !v)}
                className="pointer-events-auto text-muted-foreground hover:text-foreground"
              >
                {showNew ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            }
            error={errors.newPassword?.message}
            required
          />

          <Input
            {...register('confirmPassword')}
            label="Confirm new password"
            type={showConfirm ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            leftIcon={<Lock />}
            rightIcon={
              <button
                type="button"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
                onClick={() => setShowConfirm((v) => !v)}
                className="pointer-events-auto text-muted-foreground hover:text-foreground"
              >
                {showConfirm ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            }
            error={errors.confirmPassword?.message}
            required
          />

          <Button
            type="submit"
            isLoading={isChangingPassword}
            loadingText="Updating…"
          >
            Update password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
