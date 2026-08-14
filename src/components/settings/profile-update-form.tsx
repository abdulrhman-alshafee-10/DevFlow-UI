'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from 'lucide-react';

import {
  updateProfileSchema,
  type UpdateProfileFormValues,
} from '@/lib/schemas/user';
import { useUser } from '@/hooks/use-user';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

/**
 * Profile Settings form — lets the user update their display name.
 * Avatar upload is placeholder UI; fully implemented in Phase 15.
 */
export function ProfileUpdateForm() {
  const { user } = useAuth();
  const { updateProfile, isUpdatingProfile, updateProfileError } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { displayName: user?.displayName ?? '' },
  });

  // Keep form in sync if the user object changes (e.g. after a save)
  useEffect(() => {
    if (user) {
      reset({ displayName: user.displayName });
    }
  }, [user, reset]);

  // Surface API field-level errors
  useEffect(() => {
    if (updateProfileError?.errors?.displayName) {
      setError('displayName', {
        message: updateProfileError.errors.displayName,
      });
    }
  }, [updateProfileError, setError]);

  function onSubmit(values: UpdateProfileFormValues) {
    updateProfile({ displayName: values.displayName });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Update your display name and manage your avatar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar section — placeholder UI */}
        <div className="flex items-center gap-4">
          <Avatar
            src={user?.avatarUrl ?? undefined}
            name={user?.displayName ?? 'User'}
            size="lg"
          />
          <div className="space-y-1">
            <p className="text-sm font-medium">Profile photo</p>
            <p className="text-xs text-muted-foreground">
              Avatar upload coming in Phase 15.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled
              aria-disabled="true"
            >
              Change photo
            </Button>
          </div>
        </div>

        {/* Read-only email */}
        <div className="space-y-1.5">
          <Label htmlFor="profile-email">Email address</Label>
          <div
            id="profile-email"
            aria-readonly="true"
            className="flex h-9 w-full rounded-md border border-border bg-muted px-3 py-1 text-sm text-muted-foreground"
          >
            {user?.email ?? '—'}
          </div>
          <p className="text-xs text-muted-foreground">
            Email cannot be changed here. Contact support if you need to update
            it.
          </p>
        </div>

        {/* Display name form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <Input
            {...register('displayName')}
            id="display-name"
            label="Display name"
            placeholder="Your full name"
            leftIcon={<User />}
            error={errors.displayName?.message}
            required
          />

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              isLoading={isUpdatingProfile}
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
                disabled={isUpdatingProfile}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>

        {/* Account metadata */}
        <div className="space-y-1 rounded-lg border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Account ID: </span>
            {user?.id ?? '—'}
          </p>
          <p>
            <span className="font-medium text-foreground">Member since: </span>
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : '—'}
          </p>
          <p>
            <span className="font-medium text-foreground">Role: </span>
            {user?.role ?? '—'}
          </p>
          <p>
            <span className="font-medium text-foreground">
              Email verified:{' '}
            </span>
            {user?.isVerified ? 'Yes' : 'No'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
