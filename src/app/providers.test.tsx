import { render } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { Providers } from './providers';

/**
 * Task 9.2 — Toaster singleton in providers.
 *
 * `<Providers>` mounts `<Toaster />` exactly once. This test asserts
 * that exactly one sonner Toaster instance is present in the DOM
 * (Requirements 9.10, 14.1).
 *
 * ATTRIBUTE NOTE — sonner 1.7.x emits its Toaster as an outer
 * `<section aria-live="polite" aria-relevant="additions text" ...>`.
 * The task suggested checking `[data-sonner-toaster]`, but sonner
 * only stamps `data-sonner-toaster` on the inner `<ol>` and only
 * renders that `<ol>` when there is at least one active toast. On an
 * idle Providers render there are zero toasts, so the reliable
 * "Toaster is mounted once" marker is the outer live-region section.
 * Both selectors are asserted below so the singleton invariant is
 * expressed against whichever element sonner emits.
 *
 * MATCHMEDIA STUB — `next-themes` (with `enableSystem`) and sonner
 * both call `window.matchMedia` during mount to detect the user's
 * color-scheme preference. jsdom does not implement `matchMedia`, so
 * we install a minimal no-op MediaQueryList here. The stub is scoped
 * to this test file to avoid changing shared setup.
 */
beforeAll(() => {
  if (typeof window.matchMedia !== 'function') {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  }
});

describe('Providers', () => {
  it('mounts exactly one sonner Toaster instance', () => {
    render(
      <Providers>
        <div />
      </Providers>,
    );

    // Sonner's outer live-region section — always rendered while the
    // Toaster is mounted, regardless of whether a toast is queued.
    const liveRegions = document.querySelectorAll(
      'section[aria-live="polite"][aria-relevant="additions text"]',
    );
    expect(liveRegions.length).toBe(1);

    // Belt-and-braces: no orphan inner Toaster containers either.
    // (Zero when idle; must never be > 1.)
    const toasterOls = document.querySelectorAll('[data-sonner-toaster]');
    expect(toasterOls.length).toBeLessThanOrEqual(1);
  });
});
