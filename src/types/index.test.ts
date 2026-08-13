import { describe, expect, it } from 'vitest';

import { ALL_PRIORITIES, ALL_STATUSES } from '.';
import type { BadgeVariant, Priority, Status } from '.';

/**
 * Type-level regression tests for the DevFlow domain unions.
 *
 * These specs pair runtime assertions with `// @ts-expect-error` guards so
 * `tsc --noEmit` (and by extension `npm run type-check`) verifies that
 * invalid literals are rejected at compile time. The runtime `expect`
 * calls exist purely to keep the bindings live and give vitest something
 * to execute — the real test is the compiler.
 */
describe('domain type unions', () => {
  describe('Priority', () => {
    it('accepts every valid Priority literal', () => {
      const values: Priority[] = ['low', 'medium', 'high', 'urgent'];
      for (const p of values) {
        expect(ALL_PRIORITIES).toContain(p);
      }
    });

    it('rejects invalid Priority literals at compile time', () => {
      // @ts-expect-error - 'nope' is not a member of the Priority union
      const bad: Priority = 'nope';
      expect(bad).toBe('nope');
    });

    it('exposes ALL_PRIORITIES as a readonly tuple in ascending order', () => {
      expect(ALL_PRIORITIES).toEqual(['low', 'medium', 'high', 'urgent']);
    });
  });

  describe('Status', () => {
    it('accepts every valid Status literal', () => {
      const values: Status[] = [
        'backlog',
        'todo',
        'in_progress',
        'in_review',
        'done',
        'archived',
      ];
      for (const s of values) {
        expect(ALL_STATUSES).toContain(s);
      }
    });

    it('rejects invalid Status literals at compile time', () => {
      // @ts-expect-error - 'shipped' is not a member of the Status union
      const bad: Status = 'shipped';
      expect(bad).toBe('shipped');
    });

    it('exposes ALL_STATUSES as a readonly tuple in lifecycle order', () => {
      expect(ALL_STATUSES).toEqual([
        'backlog',
        'todo',
        'in_progress',
        'in_review',
        'done',
        'archived',
      ]);
    });
  });

  describe('BadgeVariant', () => {
    it('accepts every valid BadgeVariant literal', () => {
      const values: BadgeVariant[] = [
        'default',
        'secondary',
        'outline',
        'destructive',
        'success',
        'warning',
        'info',
      ];
      expect(values).toHaveLength(7);
    });

    it('rejects invalid BadgeVariant literals at compile time', () => {
      // @ts-expect-error - 'ghost' is not a member of the BadgeVariant union
      const bad: BadgeVariant = 'ghost';
      expect(bad).toBe('ghost');
    });
  });
});
