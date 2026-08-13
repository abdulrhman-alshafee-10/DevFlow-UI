import type { Metadata } from 'next';

import { VerifyEmailHandler } from '@/components/auth/verify-email-handler';

export const metadata: Metadata = { title: 'Verify email' };

/**
 * Handles two cases:
 * 1. Landed here after registration (no token) — shows "check your inbox"
 * 2. Clicked the email link (/verify-email?token=<value>) — auto-verifies
 */
export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const token = typeof params.token === 'string' ? params.token : null;
  return <VerifyEmailHandler token={token} />;
}
