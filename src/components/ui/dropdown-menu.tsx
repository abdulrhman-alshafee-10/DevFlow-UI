'use client';

import {
  Root,
  Trigger,
  Portal,
  Content,
  Item,
  Separator,
} from '@radix-ui/react-dropdown-menu';
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

/**
 * Compound `<DropdownMenu />` built on top of `@radix-ui/react-dropdown-menu`.
 *
 * The Radix primitives already own roving `tabindex`, ARIA menu roles,
 * focus return, and keyboard navigation. This module only merges DevFlow
 * design-system classes and exposes a slightly friendlier API for the
 * common `icon` + `destructive` item patterns.
 *
 * Only React children are accepted — no `dangerouslySetInnerHTML` is used
 * anywhere in this module.
 */

/**
 * Pass-through of `DropdownMenu.Root`. Consumers get every Radix Root
 * prop (`open`, `defaultOpen`, `onOpenChange`, `modal`, `dir`, `children`)
 * without any additional wrapper indirection.
 */
export const DropdownMenu = Root;

/**
 * Pass-through of `DropdownMenu.Trigger`. Radix already handles
 * `forwardRef`, keyboard activation, and open-state ARIA attributes.
 */
export const DropdownMenuTrigger = Trigger;

/** Props for {@link DropdownMenuContent}. */
export type DropdownMenuContentProps = ComponentPropsWithoutRef<typeof Content>;

/**
 * `forwardRef` wrapper around `DropdownMenu.Content` that renders inside
 * a `Portal`, applies a default `sideOffset` of `4`, and merges DevFlow
 * surface classes (radius, shadow, popover background, open/close
 * animations) with any consumer-provided `className`.
 */
export const DropdownMenuContent = forwardRef<
  ElementRef<typeof Content>,
  DropdownMenuContentProps
>(function DropdownMenuContent({ className, sideOffset = 4, ...rest }, ref) {
  return (
    <Portal>
      <Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
          className,
        )}
        {...rest}
      />
    </Portal>
  );
});
DropdownMenuContent.displayName = 'DropdownMenuContent';

/** Props accepted by {@link DropdownMenuItem}. */
export interface DropdownMenuItemProps extends ComponentPropsWithoutRef<
  typeof Item
> {
  /** When `true`, applies DevFlow's destructive color treatment. */
  destructive?: boolean;
  /**
   * Optional leading icon rendered before the item's children. Marked
   * `aria-hidden` because the item's text is the accessible label.
   */
  icon?: ReactNode;
}

/**
 * `forwardRef` wrapper around `DropdownMenu.Item`. Adds an optional
 * `icon` slot rendered before children and a `destructive` boolean that
 * applies the destructive text/focus treatment. All other props
 * (including `onSelect`) are forwarded to the underlying Radix `Item`.
 */
export const DropdownMenuItem = forwardRef<
  ElementRef<typeof Item>,
  DropdownMenuItemProps
>(function DropdownMenuItem(
  { className, destructive, icon, children, ...rest },
  ref,
) {
  return (
    <Item
      ref={ref}
      className={cn(
        'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        destructive &&
          'text-destructive focus:bg-destructive/10 focus:text-destructive',
        className,
      )}
      {...rest}
    >
      {icon !== undefined && (
        <span
          aria-hidden="true"
          className="inline-flex shrink-0 items-center [&_svg]:size-4"
        >
          {icon}
        </span>
      )}
      {children}
    </Item>
  );
});
DropdownMenuItem.displayName = 'DropdownMenuItem';

/** `forwardRef` wrapper around `DropdownMenu.Separator`. */
export const DropdownMenuSeparator = forwardRef<
  ElementRef<typeof Separator>,
  ComponentPropsWithoutRef<typeof Separator>
>(function DropdownMenuSeparator({ className, ...rest }, ref) {
  return (
    <Separator
      ref={ref}
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...rest}
    />
  );
});
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';
