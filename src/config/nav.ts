import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Settings,
} from 'lucide-react';

/**
 * Primary navigation items used by the Sidebar and MobileNav.
 * `href` maps to the Next.js route; `icon` is a lucide-react component.
 */
export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const dashboardNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'Tasks', href: '/tasks', icon: CheckSquare },
  { label: 'Settings', href: '/settings', icon: Settings },
];
