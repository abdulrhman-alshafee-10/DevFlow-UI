import type { Metadata } from 'next';

import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { ResetPasswordTokenGate } from '@/components/auth/reset-password-token-gate';

export const metadata: Metadata = { title: 'Reset password' };

/**
 * The token arrives as a query-string param: `/reset-password?token=<value>`.
 * Because this is a Server Component, `searchParams` are available directly.
 */
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const token = typeof params.token === 'string' ? params.token : null;
  return <ResetPasswordTokenGate token={token} />;
}
