'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { useMounted } from '@/hooks/use-mounted';

/**
 * Cycles between light and dark modes.
 *
 * Uses `useMounted` to avoid hydration mismatches — before the
 * client has hydrated we render a placeholder button with no icon
 * so the server-rendered HTML matches the initial client render.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  const isDark = resolvedTheme === 'dark';
  const nextTheme = isDark ? 'light' : 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
    >
      {mounted ? (
        isDark ? (
          <Sun aria-hidden="true" />
        ) : (
          <Moon aria-hidden="true" />
        )
      ) : (
        <span aria-hidden="true" className="block size-4" />
      )}
    </Button>
  );
}
