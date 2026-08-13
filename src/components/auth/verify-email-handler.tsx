'use client';

import { useEffect, useRef } from 'react';
import { MailCheck, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@/hooks/use-auth';
import { Spinner } from '@/components/ui/spinner';

interface VerifyEmailHandlerProps {
  /** The `token` query-string value extracted by the page, or null if missing. */
  token: string | null;
}

/**
 * Handles the automatic token verification flow.
 *
 * - If a `token` is present in the URL, fires the verify mutation on mount
 * - Shows a loading state while the request is in-flight
 * - Success and error states are handled via toast + inline UI
 * - If no token, shows the "check your inbox" message instead
 */
export function VerifyEmailHandler({ token }: VerifyEmailHandlerProps) {
  const { verifyEmail, isVerifyingEmail, verifyEmailError } = useAuth();
  const hasFired = useRef(false);

  useEffect(() => {
    if (token && !hasFired.current) {
      hasFired.current = true;
      verifyEmail({ token });
    }
  }, [token, verifyEmail]);

  // No token → show the "go check your inbox" state
  if (!token) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10">
          <MailCheck className="size-6 text-primary" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Check your inbox
          </h1>
          <p className="text-sm text-muted-foreground">
            We sent a verification link to your email address. Click it to
            activate your account.
          </p>
        </div>
        <Link
          href="/login"
          className="block text-xs text-muted-foreground hover:text-foreground"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  // Token present → verifying in progress
  if (isVerifyingEmail) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <Spinner className="size-8 text-primary" />
        <p className="text-sm text-muted-foreground">Verifying your email…</p>
      </div>
    );
  }

  // Token present but verification failed
  if (verifyEmailError) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-destructive/10">
          <AlertTriangle
            className="size-6 text-destructive"
            aria-hidden="true"
          />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Verification failed
          </h1>
          <p className="text-sm text-muted-foreground">
            {verifyEmailError.message ??
              'The link may have expired or already been used.'}
          </p>
        </div>
        <Link
          href="/login"
          className="text-sm font-medium text-primary hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  // Verified successfully (mutation idle after success → toast fired, redirect pending)
  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      <Spinner className="size-8 text-primary" />
      <p className="text-sm text-muted-foreground">Redirecting…</p>
    </div>
  );
}
