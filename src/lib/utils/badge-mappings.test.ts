import { describe, expect, it } from 'vitest';

import {
  priorityToBadgeVariant,
  resolveBadgeVariant,
  statusToBadgeVariant,
} from './badge-mappings';

/**
 * Example-based tests that pin the design's mapping tables from
 * `design.md` (Priority → BadgeVariant and Status → BadgeVariant) plus
 * the precedence rules of {@link resolveBadgeVariant}.
 */
describe('priorityToBadgeVariant', () => {
  it('maps low → secondary', () => {
    expect(priorityToBadgeVariant('low')).toBe('secondary');
  });

  it('maps medium → info', () => {
    expect(priorityToBadgeVariant('medium')).toBe('info');
  });

  it('maps high → warning', () => {
    expect(priorityToBadgeVariant('high')).toBe('warning');
  });

  it('maps urgent → destructive', () => {
    expect(priorityToBadgeVariant('urgent')).toBe('destructive');
  });
});

describe('statusToBadgeVariant', () => {
  it('maps backlog → outline', () => {
    expect(statusToBadgeVariant('backlog')).toBe('outline');
  });

  it('maps todo → secondary', () => {
    expect(statusToBadgeVariant('todo')).toBe('secondary');
  });

  it('maps in_progress → info', () => {
    expect(statusToBadgeVariant('in_progress')).toBe('info');
  });

  it('maps in_review → warning', () => {
    expect(statusToBadgeVariant('in_review')).toBe('warning');
  });

  it('maps done → success', () => {
    expect(statusToBadgeVariant('done')).toBe('success');
  });

  it('maps archived → outline', () => {
    expect(statusToBadgeVariant('archived')).toBe('outline');
  });
});

describe('resolveBadgeVariant', () => {
  it('returns "default" for an empty props object', () => {
    expect(resolveBadgeVariant({})).toBe('default');
  });

  it('returns the priority-derived variant when only priority is set', () => {
    expect(resolveBadgeVariant({ priority: 'urgent' })).toBe('destructive');
  });

  it('returns the status-derived variant when only status is set', () => {
    expect(resolveBadgeVariant({ status: 'in_progress' })).toBe('info');
  });

  it('returns the raw variant when only variant is set', () => {
    expect(resolveBadgeVariant({ variant: 'success' })).toBe('success');
  });

  it('lets priority win over status and variant', () => {
    expect(
      resolveBadgeVariant({
        priority: 'urgent',
        status: 'done',
        variant: 'info',
      }),
    ).toBe('destructive');
  });

  it('lets status win over variant when priority is absent', () => {
    expect(resolveBadgeVariant({ status: 'done', variant: 'info' })).toBe(
      'success',
    );
  });

  it('does not mutate the input props', () => {
    const props = {
      priority: 'high',
      status: 'todo',
      variant: 'secondary',
    } as const;
    const snapshot = { ...props };
    resolveBadgeVariant(props);
    expect(props).toEqual(snapshot);
  });
});
