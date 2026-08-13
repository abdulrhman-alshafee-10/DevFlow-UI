import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';

import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: {
    default: 'Sign in',
    template: `%s · ${siteConfig.name}`,
  },
};

/**
 * Authentication layout.
 *
 * Renders a centered card on a subtle grid background.
 * All auth routes (`/login`, `/register`, etc.) use this layout.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-background px-4">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="bg-grid bg-radial-fade pointer-events-none absolute inset-0"
      />

      {/* Logo mark */}
      <Link
        href="/"
        className="relative mb-8 flex items-center gap-2 font-display text-xl font-bold tracking-tight"
      >
        <span
          aria-hidden="true"
          className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft"
        >
          <span className="text-sm font-bold">D</span>
        </span>
        {siteConfig.name}
      </Link>

      {/* Auth card */}
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-elevated">
        {children}
      </div>

      <p className="relative mt-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} {siteConfig.name}
      </p>
    </div>
  );
}
