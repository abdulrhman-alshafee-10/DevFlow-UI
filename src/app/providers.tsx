'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';

import { Toaster } from '@/components/ui/toast';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Client-side providers composed at the root.
 *
 * `next-themes` swaps the `class` on <html> which lets Tailwind's
 * `dark:` variant kick in without any client-side re-render or FOUC.
 *
 * `<Toaster />` is mounted exactly once here so the sonner surface is
 * available anywhere in the tree via the `toast(...)` singleton
 * (see `@/components/ui/toast`).
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
