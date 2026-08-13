import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: `%s · ${siteConfig.name}`,
  },
};

/**
 * Dashboard layout.
 *
 * Server Component — passes children to the client `DashboardShell`
 * which owns the sidebar + topbar + mobile nav state machine.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
