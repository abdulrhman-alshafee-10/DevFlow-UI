import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { getInitials } from './get-initials';

const NUM_RUNS = 100;
const LETTER_RE = /\p{L}/u;

/**
 * Iterate a string by Unicode code point (surrogate-pair safe). We use
 * this to walk the result string when validating that every character is
 * an uppercase letter.
 */
function codePoints(value: string): string[] {
  return Array.from(value);
}

describe('getInitials — property tests', () => {
  // Property 1 — totality and shape.
  it('always returns "?" or a bounded string of uppercase Unicode letters', () => {
    fc.assert(
      fc.property(fc.string(), fc.integer({ min: 1, max: 5 }), (name, max) => {
        const result = getInitials(name, max);
        if (result === '?') {
          return;
        }
        expect(result.length).toBeLessThanOrEqual(max);
        for (const ch of codePoints(result)) {
          expect(ch).toBe(ch.toUpperCase());
          expect(LETTER_RE.test(ch)).toBe(true);
        }
      }),
      { numRuns: NUM_RUNS },
    );
  });

  // Property 2 — determinism.
  it('is deterministic across repeated invocations', () => {
    fc.assert(
      fc.property(fc.string(), fc.integer({ min: 1, max: 5 }), (name, max) => {
        expect(getInitials(name, max)).toBe(getInitials(name, max));
      }),
      { numRuns: NUM_RUNS },
    );
  });

  // Property 2 — bounded idempotence.
  //
  // Repeatedly initialising a string of only letters converges. After
  // the first pass, the result has no whitespace, so the next pass
  // collapses it to a single letter. That single letter is then a fixed
  // point of `getInitials`. We assert:
  //   1. the second-order application never grows,
  //   2. a third-order application equals the second (fixed point),
  //   3. when the first call already produced a single letter, that
  //      result is itself a fixed point ("initials of initials are the
  //      initials themselves").
  it('reaches a fixed point when the first call returned only letters', () => {
    fc.assert(
      fc.property(fc.string(), fc.integer({ min: 1, max: 5 }), (name, max) => {
        const first = getInitials(name, max);
        if (first === '?') {
          return;
        }
        const second = getInitials(first, max);
        const third = getInitials(second, max);
        expect(second.length).toBeLessThanOrEqual(first.length);
        expect(third).toBe(second);
        if (codePoints(first).length === 1) {
          expect(second).toBe(first);
        }
      }),
      { numRuns: NUM_RUNS },
    );
  });
});
