import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { AVATAR_HUE_PALETTE, stringToHueClass } from './string-to-hue';

const NUM_RUNS = 100;

describe('stringToHueClass — property tests', () => {
  // Property 9 (utility half) — palette membership + determinism.
  it('always returns a palette entry and is deterministic', () => {
    fc.assert(
      fc.property(fc.string(), (name) => {
        const first = stringToHueClass(name);
        const second = stringToHueClass(name);
        expect(AVATAR_HUE_PALETTE).toContain(first);
        expect(second).toBe(first);
      }),
      { numRuns: NUM_RUNS },
    );
  });
});
