import fc from 'fast-check';
import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Property 10 — Toast dispatch preserves ordering.
 *
 * Sonner enqueues dispatches on its internal store synchronously; our wrapper
 * only forwards the call. So the order in which `toast(...)` / `toast.success`
 * / `toast.error` / `toast.info` are invoked must match the order in which the
 * matching sonner function is called under the mock's call log.
 *
 * We interleave the four variants at random and check that the concatenation
 * of all mock-call `message` arguments — in wall-clock invocation order —
 * equals the input sequence.
 */

vi.mock('sonner', () => {
  const impl = vi.fn();
  return {
    toast: Object.assign(impl, {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      dismiss: vi.fn(),
    }),
    Toaster: () => null,
  };
});

import { toast as sonnerToast } from 'sonner';

import { toast } from './toast';

type Dispatch = {
  variant: 'default' | 'success' | 'error' | 'info';
  message: string;
};

const dispatchArb: fc.Arbitrary<Dispatch> = fc.record({
  variant: fc.constantFrom<Dispatch['variant']>(
    'default',
    'success',
    'error',
    'info',
  ),
  message: fc.string(),
});

interface MockWithInvocationOrder {
  mock: {
    calls: unknown[][];
    invocationCallOrder: number[];
  };
}

function captureLog(): Dispatch[] {
  const entries: Array<{ order: number; entry: Dispatch }> = [];

  const collect = (
    mockFn: MockWithInvocationOrder,
    variant: Dispatch['variant'],
  ) => {
    mockFn.mock.calls.forEach((args, i) => {
      entries.push({
        order: mockFn.mock.invocationCallOrder[i] ?? 0,
        entry: { variant, message: String(args[0]) },
      });
    });
  };

  collect(vi.mocked(sonnerToast) as MockWithInvocationOrder, 'default');
  collect(vi.mocked(sonnerToast.success) as MockWithInvocationOrder, 'success');
  collect(vi.mocked(sonnerToast.error) as MockWithInvocationOrder, 'error');
  collect(vi.mocked(sonnerToast.info) as MockWithInvocationOrder, 'info');

  entries.sort((a, b) => a.order - b.order);
  return entries.map((e) => e.entry);
}

describe('toast dispatch — Property 10 (ordering preserved)', () => {
  beforeEach(() => {
    vi.mocked(sonnerToast).mockClear();
    vi.mocked(sonnerToast.success).mockClear();
    vi.mocked(sonnerToast.error).mockClear();
    vi.mocked(sonnerToast.info).mockClear();
  });

  it('preserves the relative order of dispatched messages across variants', () => {
    fc.assert(
      fc.property(
        fc.array(dispatchArb, { minLength: 0, maxLength: 20 }),
        (dispatches) => {
          // Reset mocks for each iteration to isolate the call log.
          vi.mocked(sonnerToast).mockClear();
          vi.mocked(sonnerToast.success).mockClear();
          vi.mocked(sonnerToast.error).mockClear();
          vi.mocked(sonnerToast.info).mockClear();

          // Dispatch every record in order, all within a single synchronous tick.
          for (const { variant, message } of dispatches) {
            if (variant === 'default') {
              toast(message);
            } else {
              toast[variant](message);
            }
          }

          const captured = captureLog();

          expect(captured.length).toBe(dispatches.length);
          expect(captured.map((c) => c.message)).toEqual(
            dispatches.map((d) => d.message),
          );
          expect(captured.map((c) => c.variant)).toEqual(
            dispatches.map((d) => d.variant),
          );
        },
      ),
      { numRuns: 100 },
    );
  });
});
