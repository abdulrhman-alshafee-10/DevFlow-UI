import { cleanup, render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';

const NUM_RUNS = 100;

/**
 * Individual generated child entries: either a menu item (with a
 * non-empty label) or a separator. The item count is what we assert on;
 * separators are noise that must NOT be counted as `role="menuitem"`.
 */
const entryArb = fc.oneof(
  fc.record({
    kind: fc.constant('item' as const),
    label: fc.string({ minLength: 1, maxLength: 8 }),
  }),
  fc.record({
    kind: fc.constant('separator' as const),
  }),
);

const childrenArb = fc.array(entryArb, { minLength: 0, maxLength: 12 });

// Property 7 — DropdownMenu preserves item count.
//
// For any interleaving of item and separator children, the rendered
// menu must contain exactly as many `role="menuitem"` elements as
// `item`-kind entries in the generated array. Radix owns the ARIA role
// assignment; this property verifies that our compound wrapper doesn't
// accidentally hide or duplicate items when mixed with separators.
describe('DropdownMenu — item count property', () => {
  it('renders exactly one `role="menuitem"` for each generated item entry', () => {
    fc.assert(
      fc.property(childrenArb, (entries) => {
        try {
          const expectedCount = entries.filter((e) => e.kind === 'item').length;

          render(
            <DropdownMenu open>
              <DropdownMenuTrigger>t</DropdownMenuTrigger>
              <DropdownMenuContent>
                {entries.map((entry, index) =>
                  entry.kind === 'item' ? (
                    <DropdownMenuItem key={`i-${String(index)}`}>
                      {entry.label}
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuSeparator key={`s-${String(index)}`} />
                  ),
                )}
              </DropdownMenuContent>
            </DropdownMenu>,
          );

          const rendered = screen.queryAllByRole('menuitem');
          expect(rendered.length).toBe(expectedCount);
        } finally {
          cleanup();
        }
      }),
      { numRuns: NUM_RUNS },
    );
  });
});
