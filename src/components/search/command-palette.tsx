'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, X } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { Modal, ModalContent } from '@/components/ui/modal';
import { useDebounce } from '@/hooks/use-debounce';
import { SearchResults } from './search-results';
import * as searchApi from '@/lib/api/search';

/**
 * Global command palette.
 *
 * - Opens on Cmd+K / Ctrl+K from anywhere in the app.
 * - Debounces the query 300 ms before firing the search request.
 * - Results are grouped: Tasks → Projects → Members.
 * - Keyboard: Esc closes, ↑↓ navigate rows (handled by the browser's
 *   natural focus flow since every row is a focusable <a>).
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  // ── Keyboard shortcut ──────────────────────────────────────────────────
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // Focus the input once the modal is open
  useEffect(() => {
    if (open) {
      // Small delay lets Radix finish its open animation
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    } else {
      // Clear the query when closing so the next open starts fresh
      setQuery('');
    }
  }, [open]);

  // ── Search query ───────────────────────────────────────────────────────
  const { data: results, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchApi.search(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 10_000,
  });

  const hasQuery = query.length > 0;

  return (
    <>
      {/* Trigger button — shown in the Topbar */}
      <button
        type="button"
        aria-label="Open search  (Ctrl+K)"
        aria-keyshortcuts="Control+K Meta+K"
        onClick={() => setOpen(true)}
        className={cn(
          'hidden items-center gap-2 rounded-md border border-input bg-muted/40 px-3 py-1.5',
          'text-sm text-muted-foreground transition-colors hover:bg-muted',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'md:flex',
        )}
      >
        <Search className="size-3.5 shrink-0" aria-hidden="true" />
        <span>Search…</span>
        <kbd className="ml-auto rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      {/* Modal */}
      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent
          className="max-w-xl gap-0 overflow-hidden p-0"
          aria-label="Global search"
          showOverlay
        >
          {/* Search input row */}
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="search"
              role="combobox"
              aria-expanded={Boolean(results)}
              aria-autocomplete="list"
              aria-controls="search-results-list"
              aria-label="Search tasks, projects, and members"
              placeholder="Search tasks, projects, members…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none"
            />
            {hasQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="rounded p-0.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Results */}
          <div
            id="search-results-list"
            className="max-h-[420px] overflow-y-auto"
          >
            <SearchResults
              query={query}
              results={results}
              isLoading={isLoading && debouncedQuery.length >= 2}
              onClose={() => setOpen(false)}
            />
          </div>

          {/* Footer hint */}
          <div className="flex items-center gap-3 border-t border-border px-3 py-2 text-xs text-muted-foreground">
            <span>
              <kbd className="rounded border border-border px-1 py-0.5 font-medium">
                ↑↓
              </kbd>{' '}
              navigate
            </span>
            <span>
              <kbd className="rounded border border-border px-1 py-0.5 font-medium">
                ↵
              </kbd>{' '}
              open
            </span>
            <span>
              <kbd className="rounded border border-border px-1 py-0.5 font-medium">
                Esc
              </kbd>{' '}
              close
            </span>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
