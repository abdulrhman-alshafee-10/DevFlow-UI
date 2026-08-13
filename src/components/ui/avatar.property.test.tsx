import { cleanup, render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { describe, it } from 'vitest';

import { getInitials } from '@/lib/utils';

import { Avatar } from './avatar';

const NUM_RUNS = 100;

/**
 * Property 8 — Avatar renders identifiable text when image is absent.
 *
 * For any `AvatarProps` where `src` is undefined, the rendered fallback:
 *   - contains `initials ?? getInitials(name)` as visible text, and
 *   - exposes an accessible name equal to `name` (via `aria-label`).
 */
describe('Avatar — Property 8 (identifiable fallback)', () => {
  it('shows initials text and exposes name as accessible name', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string(),
          initials: fc.option(fc.string(), { nil: undefined }),
        }),
        (p) => {
          try {
            render(<Avatar name={p.name} initials={p.initials} />);

            const expectedText = p.initials ?? getInitials(p.name);
            // Query by aria-label — this asserts the accessible name
            // equals `p.name` in a single call. We pass an identity
            // normalizer so whitespace-only or empty names are compared
            // verbatim against the `aria-label` attribute value.
            const fallback = screen.getByLabelText(p.name, {
              normalizer: (s) => s,
            });
            if (fallback.textContent !== expectedText) {
              throw new Error(
                `expected fallback text to equal ${JSON.stringify(
                  expectedText,
                )}, got ${JSON.stringify(fallback.textContent)}`,
              );
            }
          } finally {
            cleanup();
          }
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });
});
