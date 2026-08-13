import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import type { BadgeVariant } from '@/types';
import { ALL_PRIORITIES, ALL_STATUSES } from '@/types';

import {
  priorityToBadgeVariant,
  resolveBadgeVariant,
  statusToBadgeVariant,
} from './badge-mappings';

const NUM_RUNS = 100;

/** Every legal {@link BadgeVariant} literal — used for membership assertions. */
const ALL_BADGE_VARIANTS: readonly BadgeVariant[] = [
  'default',
  'secondary',
  'outline',
  'destructive',
  'success',
  'warning',
  'info',
];

describe('badge-mappings — property tests', () => {
  // Property 3 — Priority mapper totality
  it('priorityToBadgeVariant returns a BadgeVariant for every Priority (deterministic)', () => {
    fc.assert(
      fc.property(fc.constantFrom(...ALL_PRIORITIES), (priority) => {
        const first = priorityToBadgeVariant(priority);
        const second = priorityToBadgeVariant(priority);
        expect(ALL_BADGE_VARIANTS).toContain(first);
        expect(second).toBe(first);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  // Property 4 — Status mapper totality
  it('statusToBadgeVariant returns a BadgeVariant for every Status (deterministic)', () => {
    fc.assert(
      fc.property(fc.constantFrom(...ALL_STATUSES), (status) => {
        const first = statusToBadgeVariant(status);
        const second = statusToBadgeVariant(status);
        expect(ALL_BADGE_VARIANTS).toContain(first);
        expect(second).toBe(first);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  // Property 5 — resolveBadgeVariant precedence
  it('resolveBadgeVariant honors the priority > status > variant > "default" chain', () => {
    const priorityArb = fc.option(fc.constantFrom(...ALL_PRIORITIES), {
      nil: undefined,
    });
    const statusArb = fc.option(fc.constantFrom(...ALL_STATUSES), {
      nil: undefined,
    });
    const variantArb = fc.option(fc.constantFrom(...ALL_BADGE_VARIANTS), {
      nil: undefined,
    });

    fc.assert(
      fc.property(
        fc.record({
          priority: priorityArb,
          status: statusArb,
          variant: variantArb,
        }),
        (props) => {
          const actual = resolveBadgeVariant(props);
          if (props.priority !== undefined) {
            expect(actual).toBe(priorityToBadgeVariant(props.priority));
          } else if (props.status !== undefined) {
            expect(actual).toBe(statusToBadgeVariant(props.status));
          } else if (props.variant !== undefined) {
            expect(actual).toBe(props.variant);
          } else {
            expect(actual).toBe('default');
          }
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });
});
