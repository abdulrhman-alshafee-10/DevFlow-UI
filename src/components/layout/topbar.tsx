'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, ChevronRight, Bell } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Avatar } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { buttonVariants } from '@/components/ui/button';
import { dashboardNav } from '@/config/nav';

interface TopbarProps {
  onMenuClick: () => void;
}

/**
 * Builds a breadcrumb trail from the current pathname.
 *
 * Examples:
 *   /dashboard           → [{ label: 'Dashboard', href: '/dashboard' }]
 *   /projects/my-project → [{ label: 'Projects', href: '/projects' },
 *                           { label: 'My Project', href: '/projects/my-project' }]
 */
function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  return segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return { label, href };
  });
}

/**
 * Dashboard top navigation bar.
 *
 * - Hamburger button (mobile only) to open `MobileNav`
 * - Breadcrumb trail derived from `usePathname()`
 * - Notification bell placeholder
 * - Theme toggle
 * - User profile dropdown
 */
export function Topbar({ onMenuClick }: TopbarProps) {
  const breadcrumbs = useBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      {/* Mobile menu toggle */}
      <button
        type="button"
        aria-label="Open navigation menu"
        onClick={onMenuClick}
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'md:hidden',
        )}
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
        <ol className="flex items-center gap-1 text-sm" role="list">
          {breadcrumbs.map(({ label, href }, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <li key={href} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight
                    className="size-3.5 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                )}
                {isLast ? (
                  <span
                    aria-current="page"
                    className="truncate font-medium text-foreground"
                  >
                    {label}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="truncate text-muted-foreground hover:text-foreground"
                  >
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Notification bell — placeholder for Phase 8+ */}
        <button
          type="button"
          aria-label="Notifications"
          className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
        >
          <Bell className="size-4" aria-hidden="true" />
        </button>

        <ThemeToggle />

        {/* User profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Open user menu"
              className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Avatar name="Demo User" size="sm" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            {/* User info header — not a focusable item */}
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">Demo User</p>
              <p className="text-xs text-muted-foreground">demo@devflow.app</p>
            </div>
            <DropdownMenuSeparator />
            {dashboardNav.map(({ label, href, icon: Icon }) => (
              <DropdownMenuItem key={href} asChild>
                <Link href={href} className="flex items-center gap-2">
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
