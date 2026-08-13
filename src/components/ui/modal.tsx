'use client';

import { forwardRef } from 'react';
import type {
  ComponentPropsWithoutRef,
  ElementRef,
  HTMLAttributes,
  ReactNode,
} from 'react';

// Named imports from Radix so tree-shaking is preserved (Requirement 14.6).
// Aliases give us DevFlow-friendly names inside this module and avoid the
// `DialogPrimitive.*` dotted access pattern.
import {
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Title,
  Description,
  Close,
} from '@radix-ui/react-dialog';

import { cn } from '@/lib/utils/cn';

/**
 * DevFlow Modal — a thin compound layer over Radix Dialog.
 *
 * Radix owns behavior (focus trap, focus restore, `aria-modal`, scroll
 * lock, Esc handling, pointer-outside handling). This module owns only
 * visual styling, a small `showOverlay` opt-out, and DevFlow-friendly
 * component names. `onEscapeKeyDown` / `onPointerDownOutside` are never
 * intercepted by the wrapper — consumers may pass their own handlers.
 *
 * Content is accepted exclusively via React children — no
 * `dangerouslySetInnerHTML` anywhere in this module.
 */

/**
 * Root wrapper for the modal. Forwards every Radix `Dialog.Root` prop
 * (`open`, `defaultOpen`, `onOpenChange`, `modal`, `children`) untouched.
 *
 * A function wrapper (rather than `export const Modal = Root`) gives us
 * a stable `displayName` in React DevTools without changing behavior.
 */
export function Modal(
  props: ComponentPropsWithoutRef<typeof Root>,
): JSX.Element {
  return <Root {...props} />;
}
Modal.displayName = 'Modal';

/** Trigger element that toggles the modal open. Alias of Radix `Trigger`. */
export const ModalTrigger = Trigger;

/** Explicit close primitive for consumer-driven close buttons. */
export const ModalClose = Close;

/**
 * Portaled backdrop element. Exported so consumers can compose their
 * own content layouts if they need to bypass {@link ModalContent}.
 * `data-testid="modal-overlay"` lets tests assert presence/absence
 * without relying on Radix's internal DOM shape.
 */
export const ModalOverlay = forwardRef<
  ElementRef<typeof Overlay>,
  ComponentPropsWithoutRef<typeof Overlay>
>(function ModalOverlay({ className, ...rest }, ref) {
  return (
    <Overlay
      ref={ref}
      data-testid="modal-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-background/80 backdrop-blur-sm',
        className,
      )}
      {...rest}
    />
  );
});
ModalOverlay.displayName = 'ModalOverlay';

/** Props for {@link ModalContent}. */
export interface ModalContentProps extends ComponentPropsWithoutRef<
  typeof Content
> {
  /**
   * When `true` (default) the DevFlow overlay is rendered behind the
   * content. Set to `false` for a bare-content presentation (e.g. a
   * modal that intentionally overlays part of the app chrome).
   */
  showOverlay?: boolean;
  /** Children rendered inside the dialog surface. */
  children?: ReactNode;
}

/**
 * Portaled dialog content with the DevFlow surface treatment. Every
 * prop other than {@link ModalContentProps.showOverlay}, `className`,
 * and `children` is forwarded verbatim to `Dialog.Content` — including
 * Radix's own `onEscapeKeyDown` / `onPointerDownOutside` callbacks
 * which we intentionally do not intercept.
 */
export const ModalContent = forwardRef<
  ElementRef<typeof Content>,
  ModalContentProps
>(function ModalContent(
  { className, children, showOverlay = true, ...rest },
  ref,
) {
  return (
    <Portal>
      {showOverlay !== false && <ModalOverlay />}
      <Content
        ref={ref}
        className={cn(
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg',
          className,
        )}
        {...rest}
      >
        {children}
      </Content>
    </Portal>
  );
});
ModalContent.displayName = 'ModalContent';

/** Plain layout wrapper for the header block above the title/description. */
export function ModalHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div
      className={cn(
        'flex flex-col gap-1.5 text-center sm:text-left',
        className,
      )}
      {...props}
    />
  );
}
ModalHeader.displayName = 'ModalHeader';

/** Plain layout wrapper for the footer/action row of the modal. */
export function ModalFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  );
}
ModalFooter.displayName = 'ModalFooter';

/** Accessible dialog title. Wraps Radix `Dialog.Title` with DevFlow styling. */
export const ModalTitle = forwardRef<
  ElementRef<typeof Title>,
  ComponentPropsWithoutRef<typeof Title>
>(function ModalTitle({ className, ...props }, ref) {
  return (
    <Title
      ref={ref}
      className={cn(
        'text-lg font-semibold leading-none tracking-tight',
        className,
      )}
      {...props}
    />
  );
});
ModalTitle.displayName = 'ModalTitle';

/** Accessible dialog description. Wraps Radix `Dialog.Description`. */
export const ModalDescription = forwardRef<
  ElementRef<typeof Description>,
  ComponentPropsWithoutRef<typeof Description>
>(function ModalDescription({ className, ...props }, ref) {
  return (
    <Description
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
});
ModalDescription.displayName = 'ModalDescription';
