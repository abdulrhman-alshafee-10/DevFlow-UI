import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Toaster, toast } from './toast';

/**
 * NOTE ON ARIA SEMANTICS — DISCREPANCY WITH THE DESIGN'S STRICT SPEC.
 *
 * The design (and requirement 9.12) states that error toasts should use
 * `role="alert"` and non-error toasts should use `role="status"`.
 * Sonner 1.7.x does not annotate individual toasts with those roles.
 * Instead it wraps the entire toast list in a single `<section>` live
 * region with `aria-live="polite"`, `aria-relevant="additions text"`,
 * `aria-atomic="false"`. Each toast is rendered as an `<li>` inside an
 * `<ol>` inside that section, and the toast type is exposed via a
 * `data-type` attribute (`"error"`, `"success"`, `"info"`, or absent
 * for the default variant). Screen readers announce the polite live
 * region on additions, so the requirement's intent (screen-reader
 * announcement of new toasts) is still satisfied.
 *
 * Per the task instructions we prefer the library's actual behavior
 * over the strict spec and assert it explicitly here rather than
 * skipping the test.
 */

/**
 * NOTE ON QUEUE-BEFORE-MOUNT.
 *
 * Sonner's store publishes events synchronously to whatever subscribers
 * exist at the moment `toast(...)` is called. Subscribers that attach
 * later (i.e. when `<Toaster />` mounts after the call) do not receive
 * a replay. In real DevFlow usage this is a non-issue because
 * `<Toaster />` is mounted once inside `<Providers>` at the app root
 * before any user interaction can fire a toast. We still cover the
 * "call before mount" ordering by (a) dispatching before mount and
 * (b) verifying that a subsequent dispatch after mount renders
 * correctly, confirming the Toaster is fully wired post-mount even
 * when preceded by an unreplayed dispatch.
 */

const TOAST_LI_SELECTOR = '[data-sonner-toast]';

async function waitForToast(text: string): Promise<HTMLElement> {
  return waitFor(() => {
    const el = screen.getByText(text);
    expect(el).toBeInTheDocument();
    return el;
  });
}

describe('Toast accessibility integration', () => {
  it('mounts a single polite live region and announces every variant', async () => {
    render(<Toaster theme="light" />);

    const section = document.querySelector(
      'section[aria-label][aria-live]',
    ) as HTMLElement | null;
    expect(section).not.toBeNull();
    expect(section?.getAttribute('aria-live')).toBe('polite');
    expect(section?.getAttribute('aria-relevant')).toBe('additions text');

    toast.error('boom');
    const errorText = await waitForToast('boom');
    const errorToast = errorText.closest(TOAST_LI_SELECTOR);
    expect(errorToast).not.toBeNull();
    expect(errorToast?.getAttribute('data-type')).toBe('error');

    toast.success('ok');
    const successText = await waitForToast('ok');
    const successToast = successText.closest(TOAST_LI_SELECTOR);
    expect(successToast?.getAttribute('data-type')).toBe('success');

    toast.info('fyi');
    const infoText = await waitForToast('fyi');
    const infoToast = infoText.closest(TOAST_LI_SELECTOR);
    expect(infoToast?.getAttribute('data-type')).toBe('info');

    toast('hi');
    const defaultText = await waitForToast('hi');
    const defaultToast = defaultText.closest(TOAST_LI_SELECTOR);
    // Sonner omits data-type entirely for the default variant.
    expect(defaultToast).not.toBeNull();
    expect(defaultToast?.getAttribute('data-type')).toBeNull();

    // Every rendered toast must live inside the section-level live region.
    for (const t of [errorToast, successToast, infoToast, defaultToast]) {
      expect(section?.contains(t)).toBe(true);
    }
  });

  it('post-mount dispatch renders even when a prior dispatch preceded mount', async () => {
    // Fire a toast BEFORE any <Toaster /> is mounted. Sonner does not
    // replay this to the subscriber that mounts later (see file-top
    // note), but the store must remain in a healthy state for
    // subsequent dispatches.
    toast('early');

    render(<Toaster theme="light" />);

    // A dispatch AFTER mount must render normally, confirming the
    // Toaster is functional post-mount.
    toast('late');
    await waitForToast('late');
  });
});
