'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Client-side providers composed at the root.
 *
 * `next-themes` swaps the `class` on <html> which lets Tailwind's
 * `dark:` variant kick in without any client-side re-render or FOUC.
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
    </ThemeProvider>
  );
}
