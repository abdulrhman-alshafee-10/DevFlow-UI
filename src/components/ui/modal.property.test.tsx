import { cleanup, render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { Modal, ModalContent, ModalTitle } from './modal';

const NUM_RUNS = 100;

/**
 * Property 6 — Controlled Modal state consistency.
 *
 * For any sequence of `open` values applied via `rerender`, the modal's
 * body text is present in the DOM iff the most recent value is `true`.
 * The sequence generator has minLength 1 so we always exercise at least
 * one transition.
 */
describe('Modal — property tests', () => {
  it('content visibility mirrors the controlled `open` prop across a sequence of updates', () => {
    fc.assert(
      fc.property(
        fc.array(fc.boolean(), { minLength: 1, maxLength: 20 }),
        (sequence) => {
          // fast-check owns iteration; clean up any React trees from
          // previous property runs before rendering the next.
          cleanup();

          const first = sequence[0] as boolean;
          const { rerender } = render(
            <Modal open={first}>
              <ModalContent>
                <ModalTitle>content</ModalTitle>
              </ModalContent>
            </Modal>,
          );

          const assertPresence = (isOpen: boolean): void => {
            const found = screen.queryByText('content');
            if (isOpen) {
              expect(found).not.toBeNull();
            } else {
              expect(found).toBeNull();
            }
          };

          assertPresence(first);

          for (let i = 1; i < sequence.length; i += 1) {
            const next = sequence[i] as boolean;
            rerender(
              <Modal open={next}>
                <ModalContent>
                  <ModalTitle>content</ModalTitle>
                </ModalContent>
              </Modal>,
            );
            assertPresence(next);
          }
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });
});
