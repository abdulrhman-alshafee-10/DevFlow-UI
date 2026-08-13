/**
 * Property-based test for `<Badge />` variant resolution.
 *
 * Verifies end-to-end that the class tokens applied to the rendered
 * `<span>` match `badgeVariants({ variant: resolveBadgeVariant(props) })`
 * for every combination of `priority`, `status`, and `variant` props —
 * i.e. that the design-locked precedence contract
 * (`priority > status > variant > 'default'`) survives the trip through
 * the React component.
 *
 * _Property: 5_
 * _Requirements: 2.5, 2.6, 2.7, 2.8_
 */
import { cleanup, render } from '@testing-library/react';
import fc from 'fast-check';
import { describe, it } from 'vitest';

import { resolveBadgeVariant } from '@/lib/utils';
import type { BadgeVariant, Priority, Status } from '@/types';
import { ALL_PRIORITIES, ALL_STATUSES } from '@/types';

import { Badge, badgeVariants } from './badge';

const ALL_BADGE_VARIANTS: readonly BadgeVariant[] = [
  'default',
  'secondary',
  'outline',
  'destructive',
  'success',
  'warning',
  'info',
] as const;

interface GeneratedBadgeProps {
  priority?: Priority;
  status?: Status;
  variant?: BadgeVariant;
}

const badgePropsArb: fc.Arbitrary<GeneratedBadgeProps> = fc.record({
  priority: fc.option(fc.constantFrom(...ALL_PRIORITIES), { nil: undefined }),
  status: fc.option(fc.constantFrom(...ALL_STATUSES), { nil: undefined }),
  variant: fc.option(fc.constantFrom(...ALL_BADGE_VARIANTS), {
    nil: undefined,
  }),
});

describe('<Badge /> — property: variant resolution end-to-end', () => {
  it('applies every class from badgeVariants(resolveBadgeVariant(props))', () => {
    fc.assert(
      fc.property(badgePropsArb, (props) => {
        try {
          const { container } = render(<Badge {...props}>x</Badge>);
          const badge = container.firstElementChild as HTMLElement | null;

          if (badge === null) {
            throw new Error('Badge did not render a root element');
          }

          const expected = resolveBadgeVariant(props);
          const expectedClasses = badgeVariants({ variant: expected });

          for (const cls of expectedClasses.split(/\s+/u).filter(Boolean)) {
            if (!badge.classList.contains(cls)) {
              throw new Error(
                `Missing class "${cls}" for props ${JSON.stringify(
                  props,
                )} (expected variant "${expected}")`,
              );
            }
          }
        } finally {
          cleanup();
        }
      }),
      { numRuns: 100 },
    );
  });
});
