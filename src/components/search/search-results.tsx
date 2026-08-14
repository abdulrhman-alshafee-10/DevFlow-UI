'use client';

import Link from 'next/link';
import { ClipboardList, FolderOpen, User, ArrowRight } from 'lucide-react';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import type { SearchResponse } from '@/lib/api/search';

// ── Section wrapper ────────────────────────────────────────────────────────

function ResultSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <ul role="group" aria-label={title}>
        {children}
      </ul>
    </div>
  );
}

// ── Result row ─────────────────────────────────────────────────────────────

interface ResultRowProps {
  href: string;
  onClick: () => void;
  icon: React.ReactNode;
  primary: string;
  secondary?: string;
  badge?: React.ReactNode;
}

function ResultRow({
  href,
  onClick,
  icon,
  primary,
  secondary,
  badge,
}: ResultRowProps) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground group-hover:bg-background">
          {icon}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground">{primary}</p>
          {secondary && (
            <p className="truncate text-xs text-muted-foreground">
              {secondary}
            </p>
          )}
        </div>

        {badge}

        <ArrowRight
          className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        />
      </Link>
    </li>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

interface SearchResultsProps {
  query: string;
  results: SearchResponse | undefined;
  isLoading: boolean;
  onClose: () => void;
}

export function SearchResults({
  query,
  results,
  isLoading,
  onClose,
}: SearchResultsProps) {
  if (!query || query.length < 2) {
    return (
      <p className="px-4 py-8 text-center text-sm text-muted-foreground">
        Type at least 2 characters to search…
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Spinner className="size-5" label="Searching" />
      </div>
    );
  }

  const hasResults =
    results &&
    (results.tasks.length > 0 ||
      results.projects.length > 0 ||
      results.users.length > 0);

  if (!hasResults) {
    return (
      <p className="px-4 py-8 text-center text-sm text-muted-foreground">
        No results for <span className="font-medium">"{query}"</span>
      </p>
    );
  }

  return (
    <div className="space-y-1 py-1">
      {/* Tasks */}
      {results.tasks.length > 0 && (
        <ResultSection title="Tasks">
          {results.tasks.map((t) => (
            <ResultRow
              key={t.id}
              href={t.url}
              onClick={onClose}
              icon={<ClipboardList className="size-3.5" aria-hidden="true" />}
              primary={t.title}
              secondary={t.projectName}
              badge={
                <Badge
                  priority={t.priority as never}
                  className="shrink-0 text-[10px]"
                >
                  {t.priority}
                </Badge>
              }
            />
          ))}
        </ResultSection>
      )}

      {/* Projects */}
      {results.projects.length > 0 && (
        <ResultSection title="Projects">
          {results.projects.map((p) => (
            <ResultRow
              key={p.id}
              href={p.url}
              onClick={onClose}
              icon={<FolderOpen className="size-3.5" aria-hidden="true" />}
              primary={p.name}
              secondary={p.orgName}
            />
          ))}
        </ResultSection>
      )}

      {/* Users */}
      {results.users.length > 0 && (
        <ResultSection title="Members">
          {results.users.map((u) => (
            <ResultRow
              key={u.id}
              href={`/profile/${u.id}`}
              onClick={onClose}
              icon={
                <Avatar
                  src={u.avatarUrl ?? undefined}
                  name={u.displayName}
                  size="xs"
                />
              }
              primary={u.displayName}
              secondary={u.email}
            />
          ))}
        </ResultSection>
      )}
    </div>
  );
}
