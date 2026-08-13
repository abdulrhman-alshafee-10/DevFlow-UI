'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { useTheme } from 'next-themes';
import type { ExternalToast } from 'sonner';
import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';

/**
 * The four DevFlow toast variants. Maps 1:1 onto sonner's default/success/error/info
 * helpers; other sonner variants (loading, warning, custom) are intentionally not
 * exposed here to keep the DevFlow surface focused.
 */
export type ToastVariant = 'default' | 'success' | 'error' | 'info';

/**
 * Options accepted by every `toast(...)`, `toast.success(...)`, `toast.error(...)`,
 * and `toast.info(...)` call. Every field is optional and passed through to sonner
 * as-is: when a field is omitted here, it is likewise omitted from the sonner call,
 * so the surrounding <Toaster /> defaults (duration, position, closeButton, ...)
 * apply naturally.
 */
export interface ToastOptions {
  /** Optional supporting text under the title. */
  description?: ReactNode;
  /** Auto-dismiss duration in ms. When omitted the Toaster's default (4000 ms) applies. */
  duration?: number;
  /** Action affordance rendered inline. Sonner accepts the same shape. */
  action?: { label: string; onClick: () => void };
  /** Explicit id — enables deduping / updating an existing toast. */
  id?: string | number;
}

/**
 * Public shape of the `toast` singleton. Callable form dispatches a neutral toast;
 * `.success`, `.error`, `.info` dispatch the corresponding variant; `.dismiss`
 * dismisses a specific toast (or all of them when `id` is omitted).
 */
export interface ToastAPI {
  (message: ReactNode, options?: ToastOptions): string | number;
  success(message: ReactNode, options?: ToastOptions): string | number;
  error(message: ReactNode, options?: ToastOptions): string | number;
  info(message: ReactNode, options?: ToastOptions): string | number;
  dismiss(id?: string | number): void;
}

/**
 * Props accepted by the DevFlow `<Toaster />` wrapper. Mirrors sonner's own
 * Toaster props so consumers (and tests) can override any default.
 */
export type ToasterProps = ComponentPropsWithoutRef<typeof SonnerToaster>;

/**
 * Client-side toast surface. Mounted once inside `Providers` (see task 9.1).
 *
 * Reads the current theme via `next-themes` so toasts follow the app's light/dark
 * mode automatically. Consumer props are spread last, letting tests inject a
 * specific `theme`, `position`, `duration`, etc.
 */
export function Toaster(props: ToasterProps) {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      theme={(resolvedTheme as 'light' | 'dark') ?? 'system'}
      position="top-right"
      duration={4000}
      closeButton
      // `richColors` opts sonner into variant-tinted surfaces
      // (success/error/info/warning) instead of the neutral default.
      richColors
      // Pin the icon to the top-left of the toast row instead of
      // sonner's default vertically-centered alignment — otherwise the
      // icon appears floating in the middle when the toast has both a
      // title and a description.
      toastOptions={{
        classNames: {
          toast: 'items-start',
          icon: 'mt-0.5',
        },
      }}
      {...props}
    />
  );
}

/**
 * Callable form: dispatches a neutral toast via `sonnerToast(...)`. Options
 * are forwarded as-is; when `duration` is omitted, no explicit `duration` is
 * passed so the <Toaster /> default (4000 ms) applies.
 */
const toastImpl = (
  message: ReactNode,
  options?: ToastOptions,
): string | number =>
  sonnerToast(message, options as ExternalToast | undefined);

/**
 * Public `toast` singleton. Callable + variant helpers + dismiss.
 *
 * Implementation note: we build the callable form first (so `toast('hi')` is a
 * plain function call) and then attach the variant helpers via `Object.assign`
 * — this is the idiomatic way to type a callable-with-methods surface in TS.
 * The final cast to `ToastAPI` is safe because each attached helper delegates
 * to the matching sonner method with the same signature.
 */
export const toast: ToastAPI = Object.assign(toastImpl, {
  success: (message: ReactNode, options?: ToastOptions): string | number =>
    sonnerToast.success(message, options as ExternalToast | undefined),
  error: (message: ReactNode, options?: ToastOptions): string | number =>
    sonnerToast.error(message, options as ExternalToast | undefined),
  info: (message: ReactNode, options?: ToastOptions): string | number =>
    sonnerToast.info(message, options as ExternalToast | undefined),
  dismiss: (id?: string | number): void => {
    sonnerToast.dismiss(id);
  },
}) as ToastAPI;
