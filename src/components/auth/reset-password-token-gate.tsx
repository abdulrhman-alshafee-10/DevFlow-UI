import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

import { ResetPasswordForm } from '@/components/auth/reset-password-form';

interface ResetPasswordTokenGateProps {
  token: string | null;
}

/**
 * Server-renderable wrapper that either shows the form (valid token) or a
 * friendly error (missing token). This keeps the page a Server Component
 * while `ResetPasswordForm` stays a client component.
 */
export function ResetPasswordTokenGate({ token }: ResetPasswordTokenGateProps) {
  if (!token) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-destructive/10">
          <AlertTriangle
            className="size-6 text-destructive"
            aria-hidden="true"
          />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Invalid link</h1>
          <p className="text-sm text-muted-foreground">
            This password reset link is missing a token. Please request a new
            one.
          </p>
        </div>
        <Link
          href="/reset-password"
          className="block text-sm font-medium text-primary hover:underline"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return <ResetPasswordForm token={token} />;
}
