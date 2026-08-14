import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';
import { Spinner } from '@/components/ui/spinner';

// ── Column definition ──────────────────────────────────────────────────────

export interface DataTableColumn<T> {
  /** Unique key — also used as React key for the `<th>`. */
  key: string;
  /** Column header label. */
  header: string;
  /** How wide the column should be. Optional Tailwind width class, e.g. `"w-1/3"`. */
  className?: string;
  /** Render the cell content for a row. */
  cell: (row: T) => ReactNode;
}

// ── Props ──────────────────────────────────────────────────────────────────

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  /** Key extractor. Used as the `key` prop for each `<tr>`. */
  rowKey: (row: T) => string;
  isLoading?: boolean;
  /** Message shown when data is empty and not loading. */
  emptyMessage?: string;
  className?: string;
}

/**
 * Generic, accessible data table with loading and empty states.
 *
 * Accepts a typed column config so each cell renderer is fully type-safe.
 * Pagination is handled externally — this component renders whatever slice
 * of data it receives.
 */
export function DataTable<T>({
  columns,
  data,
  rowKey,
  isLoading,
  emptyMessage = 'No data found.',
  className,
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        'w-full overflow-x-auto rounded-xl border border-border',
        className,
      )}
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  'px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground',
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center">
                <Spinner label="Loading data" className="mx-auto" />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-12 text-center text-muted-foreground"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={rowKey(row)}
                className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn('px-4 py-3 align-middle', col.className)}
                  >
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
