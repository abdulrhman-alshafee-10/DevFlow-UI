import type { Metadata } from 'next';
import Link from 'next/link';
import { MailCheck } from 'lucide-react';

export const metadata: Metadata = { title: 'Verify email' };

export default function VerifyEmailPage() {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10">
        <MailCheck className="size-6 text-primary" aria-hidden="true" />
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Check your inbox</h1>
        <p className="text-sm text-muted-foreground">
          We sent a verification link to your email address. Click it to
          activate your account.
        </p>
      </div>

      <p className="text-sm text-muted-foreground">
        Didn&apos;t get it?{' '}
        <button
          type="button"
          className="font-medium text-primary hover:underline"
        >
          Resend email
        </button>
      </p>

      <Link
        href="/login"
        className="block text-xs text-muted-foreground hover:text-foreground"
      >
        Back to sign in
      </Link>
    </div>
  );
}
