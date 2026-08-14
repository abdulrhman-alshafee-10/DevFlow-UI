'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils/cn';
import { dashboardNav } from '@/config/nav';
import { siteConfig } from '@/config/site';
import { OrgSwitcher } from '@/components/organizations/org-switcher';

interface SidebarProps {
  /** Called when a nav link is clicked — used by MobileNav to close the drawer */
  onNavClick?: () => void;
}

/**
 * Primary navigation sidebar.
 *
 * - Fixed on desktop (hidden on mobile, rendered via MobileNav instead)
 * - Active link derived from `usePathname()`
 * - Exact match on `/dashboard`; prefix match on every other route
 */
export function Sidebar({ onNavClick }: SidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-4">
        <span
          aria-hidden="true"
          className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-soft"
        >
          <span className="text-sm font-bold">D</span>
        </span>
        <span className="font-display text-lg font-bold tracking-tight">
          {siteConfig.name}
        </span>
      </div>

      {/* Navigation */}
      <nav aria-label="Main navigation" className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-0.5" role="list">
          {dashboardNav.map(({ label, href, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={onNavClick}
                aria-current={isActive(href) ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive(href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                <Icon
                  className={cn(
                    'size-4 shrink-0',
                    isActive(href) ? 'text-primary' : 'text-muted-foreground',
                  )}
                  aria-hidden="true"
                />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer — org switcher */}
      <div className="shrink-0 border-t border-border p-3">
        <OrgSwitcher />
      </div>
    </aside>
  );
}
