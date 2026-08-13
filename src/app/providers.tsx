'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { Toaster } from '@/components/ui/toast';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Client-side providers composed at the root.
 *
 * Stack (outermost → innermost):
 * 1. `ThemeProvider` — swaps `class` on `<html>` for Tailwind dark mode
 * 2. `QueryClientProvider` — React Query client instance
 * 3. `ReactQueryDevtools` — dev-only query inspector (lazy-loaded)
 * 4. `Toaster` — global sonner toast surface
 *
 * `QueryClient` is created inside a `useState` initialiser so that each
 * component-tree instance gets its own client (important for SSR / tests)
 * without the client being re-created on every render.
 */
export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Keep data fresh for 60 s before background refetching
            staleTime: 60_000,
            // Retry failed requests once before surfacing the error
            retry: 1,
            // Don't refetch just because the window regained focus in dev
            refetchOnWindowFocus: process.env.NODE_ENV === 'production',
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
