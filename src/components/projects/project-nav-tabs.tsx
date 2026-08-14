'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, List, Settings } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

interface ProjectNavTabsProps {
  projectId: string;
}

const tabs = [
  {
    label: 'Board',
    href: (id: string) => `/projects/${id}`,
    icon: LayoutGrid,
    exact: true,
  },
  {
    label: 'List',
    href: (id: string) => `/projects/${id}/list`,
    icon: List,
    exact: false,
  },
  {
    label: 'Settings',
    href: (id: string) => `/projects/${id}/settings`,
    icon: Settings,
    exact: false,
  },
];

/**
 * Horizontal sub-navigation rendered inside the project detail layout.
 * Appears below the topbar breadcrumb, scoped to a single project.
 */
export function ProjectNavTabs({ projectId }: ProjectNavTabsProps) {
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <nav
      aria-label="Project navigation"
      className="border-b border-border bg-background"
    >
      <div className="flex gap-0 overflow-x-auto px-4 md:px-6">
        {tabs.map(({ label, href, icon: Icon, exact }) => {
          const to = href(projectId);
          const active = isActive(to, exact);

          return (
            <Link
              key={label}
              href={to}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                active
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground',
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
