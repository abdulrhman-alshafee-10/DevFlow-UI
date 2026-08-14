'use client';

import { ChevronsUpDown, Plus, Building2, Check } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils/cn';
import { useOrganizations } from '@/hooks/use-organizations';
import { Avatar } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';

interface OrgSwitcherProps {
  /** Compact mode — used in the collapsed sidebar (icon only). */
  collapsed?: boolean;
}

/**
 * Organization context switcher rendered in the sidebar footer.
 *
 * - Lists all orgs the user belongs to
 * - Marks the active one with a check
 * - Provides a shortcut to create a new org
 */
export function OrgSwitcher({ collapsed = false }: OrgSwitcherProps) {
  const { organizations, activeOrg, setActiveOrg, isLoading } =
    useOrganizations();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2">
        <Spinner className="h-4 w-4" />
        {!collapsed && (
          <span className="text-xs text-muted-foreground">Loading…</span>
        )}
      </div>
    );
  }

  if (!activeOrg && organizations.length === 0) {
    return (
      <Link
        href="/organizations/new"
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <Plus className="size-4 shrink-0" aria-hidden="true" />
        {!collapsed && 'New organization'}
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Switch organization"
          className={cn(
            'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium',
            'transition-colors hover:bg-accent hover:text-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          )}
        >
          <Avatar
            src={activeOrg?.logoUrl ?? undefined}
            name={activeOrg?.name ?? 'Org'}
            size="xs"
            aria-hidden="true"
          />
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1 truncate text-left text-sm">
                {activeOrg?.name ?? 'Select org'}
              </span>
              <ChevronsUpDown
                className="size-3.5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            </>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="top" align="start" className="w-56">
        {/* Org list */}
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onSelect={() => setActiveOrg(org)}
            className="flex items-center gap-2"
          >
            <Avatar
              src={org.logoUrl ?? undefined}
              name={org.name}
              size="xs"
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1 truncate">{org.name}</span>
            {activeOrg?.id === org.id && (
              <Check
                className="size-3.5 shrink-0 text-primary"
                aria-hidden="true"
              />
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        {/* Settings for active org */}
        {activeOrg && (
          <DropdownMenuItem asChild>
            <Link
              href={`/organizations/${activeOrg.id}/settings`}
              className="flex items-center gap-2"
            >
              <Building2 className="size-4" aria-hidden="true" />
              Organization settings
            </Link>
          </DropdownMenuItem>
        )}

        {/* Create new org */}
        <DropdownMenuItem asChild>
          <Link href="/organizations/new" className="flex items-center gap-2">
            <Plus className="size-4" aria-hidden="true" />
            New organization
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
