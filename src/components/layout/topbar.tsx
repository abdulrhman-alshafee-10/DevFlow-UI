'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, ChevronRight, Bell, LogOut } from 'lucide-react';

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
import { useAuth } from '@/hooks/use-auth';
import { ConnectionStatusDot } from '@/components/layout/connection-status-dot';

interface TopbarProps {
  onMenuClick: () => void;
}

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

export function Topbar({ onMenuClick }: TopbarProps) {
  const breadcrumbs = useBreadcrumbs();
  const { user, logout, logoutAll, isLoggingOut } = useAuth();

  const displayName = user?.displayName ?? 'Demo User';
  const email = user?.email ?? '';
  const avatarSrc = user?.avatarUrl ?? undefined;

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
      <div className="flex items-center gap-2">
        {/* Realtime connection status dot */}
        <ConnectionStatusDot />

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
              <Avatar src={avatarSrc} name={displayName} size="sm" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {/* User info — not a focusable item */}
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{displayName}</p>
              {email && (
                <p className="truncate text-xs text-muted-foreground">
                  {email}
                </p>
              )}
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
            <DropdownMenuItem
              onSelect={() => logout()}
              disabled={isLoggingOut}
              destructive
            >
              <LogOut className="size-4" aria-hidden="true" />
              {isLoggingOut ? 'Signing out…' : 'Sign out'}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => logoutAll()}
              disabled={isLoggingOut}
              destructive
            >
              <LogOut className="size-4" aria-hidden="true" />
              Sign out all devices
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
