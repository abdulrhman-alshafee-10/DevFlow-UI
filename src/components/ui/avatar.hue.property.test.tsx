import { cleanup, render } from '@testing-library/react';
import * as fc from 'fast-check';
import { describe, it } from 'vitest';

import { AVATAR_HUE_PALETTE, stringToHueClass } from '@/lib/utils';

import { Avatar } from './avatar';

const NUM_RUNS = 100;

/**
 * Property 9 — Avatar fallback color determinism.
 *
 * For any two Avatar renders that share the same `name` (and no `src`),
 * both inner fallback `<span>` elements carry the same
 * `AVATAR_HUE_PALETTE` entry — the exact class returned by
 * `stringToHueClass(name)`.
 */
describe('Avatar — Property 9 (deterministic hue)', () => {
  it('two Avatars with the same name share the same hue palette entry', () => {
    fc.assert(
      fc.property(fc.string(), (name) => {
        try {
          const first = render(<Avatar name={name} />);
          const second = render(<Avatar name={name} />);

          // The inner fallback span is the direct child of the outer
          // container span in each render's scoped container.
          const fallbackA = first.container.firstElementChild
            ?.firstElementChild as HTMLElement | null;
          const fallbackB = second.container.firstElementChild
            ?.firstElementChild as HTMLElement | null;

          if (fallbackA === null || fallbackB === null) {
            throw new Error('expected inner fallback element on both renders');
          }

          const expectedHue = stringToHueClass(name);

          const classesA = fallbackA.className.split(/\s+/u);
          const classesB = fallbackB.className.split(/\s+/u);

          if (!classesA.includes(expectedHue)) {
            throw new Error(
              `first Avatar fallback missing hue class ${expectedHue} in "${fallbackA.className}"`,
            );
          }
          if (!classesB.includes(expectedHue)) {
            throw new Error(
              `second Avatar fallback missing hue class ${expectedHue} in "${fallbackB.className}"`,
            );
          }

          // Palette-membership sanity check — the shared class must be
          // an actual `AVATAR_HUE_PALETTE` entry, not some stray class.
          if (
            !(AVATAR_HUE_PALETTE as readonly string[]).includes(expectedHue)
          ) {
            throw new Error(
              `hue class ${expectedHue} is not a member of AVATAR_HUE_PALETTE`,
            );
          }
        } finally {
          cleanup();
        }
      }),
      { numRuns: NUM_RUNS },
    );
  });
});
