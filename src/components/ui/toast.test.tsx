import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Mock the sonner module BEFORE importing our toast wrapper so the wrapper
 * closes over the mock's `sonnerToast` / `sonnerToast.*` functions. Vitest
 * hoists `vi.mock` calls to the top of the file, so this stays above imports
 * physically but runs first at evaluation time.
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

// Import AFTER the mock is registered so the wrapper picks up the mocked sonner.
import { toast as sonnerToast } from 'sonner';

import { toast } from './toast';

describe('toast helper', () => {
  beforeEach(() => {
    vi.mocked(sonnerToast).mockClear();
    vi.mocked(sonnerToast.success).mockClear();
    vi.mocked(sonnerToast.error).mockClear();
    vi.mocked(sonnerToast.info).mockClear();
    vi.mocked(sonnerToast.dismiss).mockClear();
  });

  it('callable form delegates to the sonner default with no options', () => {
    toast('hello');

    expect(sonnerToast).toHaveBeenCalledTimes(1);
    expect(sonnerToast).toHaveBeenCalledWith('hello', undefined);
  });

  it('callable form forwards options as-is', () => {
    toast('hello', { description: 'world', id: 'x' });

    expect(sonnerToast).toHaveBeenCalledWith('hello', {
      description: 'world',
      id: 'x',
    });
  });

  it('.success delegates to sonnerToast.success', () => {
    toast.success('saved');

    expect(sonnerToast.success).toHaveBeenCalledTimes(1);
    expect(sonnerToast.success).toHaveBeenCalledWith('saved', undefined);
  });

  it('.error delegates to sonnerToast.error', () => {
    toast.error('boom');

    expect(sonnerToast.error).toHaveBeenCalledTimes(1);
    expect(sonnerToast.error).toHaveBeenCalledWith('boom', undefined);
  });

  it('.info delegates to sonnerToast.info', () => {
    toast.info('fyi');

    expect(sonnerToast.info).toHaveBeenCalledTimes(1);
    expect(sonnerToast.info).toHaveBeenCalledWith('fyi', undefined);
  });

  it('.dismiss with an id delegates to sonnerToast.dismiss', () => {
    toast.dismiss('abc');

    expect(sonnerToast.dismiss).toHaveBeenCalledTimes(1);
    expect(sonnerToast.dismiss).toHaveBeenCalledWith('abc');
  });

  it('.dismiss without an id delegates with undefined (dismiss all)', () => {
    toast.dismiss();

    expect(sonnerToast.dismiss).toHaveBeenCalledTimes(1);
    expect(sonnerToast.dismiss).toHaveBeenCalledWith(undefined);
  });

  it('omitting duration does NOT inject an explicit duration on the sonner call', () => {
    toast('no-duration', { description: 'x' });
    toast.success('also-no-duration');

    // The callable form was called with the exact options object (no injected duration).
    const [, defaultOpts] = vi.mocked(sonnerToast).mock.calls[0] ?? [];
    expect(defaultOpts).toEqual({ description: 'x' });
    expect(defaultOpts).not.toHaveProperty('duration');

    // The .success form was called with undefined (no options passed).
    const [, successOpts] = vi.mocked(sonnerToast.success).mock.calls[0] ?? [];
    expect(successOpts).toBeUndefined();
  });

  it('explicit duration is forwarded through unchanged', () => {
    toast('slow', { duration: 8000 });

    expect(sonnerToast).toHaveBeenCalledWith('slow', { duration: 8000 });
  });

  it('action prop is forwarded through to sonner as-is', () => {
    const onClick = vi.fn();
    toast.error('failed', { action: { label: 'Retry', onClick } });

    expect(sonnerToast.error).toHaveBeenCalledWith('failed', {
      action: { label: 'Retry', onClick },
    });
  });
});
