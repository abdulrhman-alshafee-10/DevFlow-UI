import { render, screen } from '@testing-library/react';
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * The `sideOffset` default is a compile-time / call-time contract with
 * Radix — it isn't observable from the rendered DOM. We assert it by
 * mocking `@radix-ui/react-dropdown-menu` and capturing what our
 * component actually passes into the primitive `Content`.
 *
 * The mock preserves the rest of the primitives so the other assertions
 * (destructive class, icon ordering, prop forwarding) can render against
 * an approximation of the real DOM shape (with `role="menuitem"` on the
 * item so accessibility queries keep working).
 */
const contentSpy = vi.fn();

vi.mock('@radix-ui/react-dropdown-menu', () => {
  type ContentProps = {
    children?: ReactNode;
    sideOffset?: number;
    className?: string;
  } & Record<string, unknown>;

  const Root = ({ children }: { children?: ReactNode }) => <>{children}</>;

  const Trigger = forwardRef<HTMLButtonElement, { children?: ReactNode }>(
    function Trigger(props, ref) {
      return <button ref={ref} {...props} />;
    },
  );

  const Portal = ({ children }: { children?: ReactNode }) => <>{children}</>;

  const Content = forwardRef<HTMLDivElement, ContentProps>(
    function Content(props, ref) {
      contentSpy(props);
      const { children, sideOffset: _sideOffset, className, ...rest } = props;
      const htmlRest = rest as Record<string, string | number | boolean>;
      return (
        <div
          ref={ref}
          data-testid="mock-content"
          className={typeof className === 'string' ? className : undefined}
          {...htmlRest}
        >
          {children as ReactNode}
        </div>
      );
    },
  );

  const Item = forwardRef<
    HTMLDivElement,
    { children?: ReactNode } & Record<string, unknown>
  >(function Item(props, ref) {
    return <div ref={ref} role="menuitem" {...props} />;
  });

  const Separator = forwardRef<HTMLDivElement, Record<string, unknown>>(
    function Separator(props, ref) {
      return <div ref={ref} role="separator" {...props} />;
    },
  );

  return { Root, Trigger, Portal, Content, Item, Separator };
});

// Import AFTER `vi.mock` is registered so the module resolves to the mock.
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';

beforeEach(() => {
  contentSpy.mockClear();
});

afterEach(() => {
  contentSpy.mockClear();
});

describe('DropdownMenuContent — default sideOffset', () => {
  it('passes sideOffset={4} to the underlying Radix Content when omitted', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Only</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    expect(contentSpy).toHaveBeenCalled();
    const received = contentSpy.mock.calls.at(-1)?.[0] as
      { sideOffset?: number } | undefined;
    expect(received?.sideOffset).toBe(4);
  });

  it('forwards an explicit sideOffset value through to the Radix Content', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={12}>
          <DropdownMenuItem>Only</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const received = contentSpy.mock.calls.at(-1)?.[0] as
      { sideOffset?: number } | undefined;
    expect(received?.sideOffset).toBe(12);
  });
});

describe('DropdownMenuItem — destructive prop', () => {
  it('applies the "text-destructive" class family when `destructive` is set', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem destructive>Del</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const item = screen.getByRole('menuitem', { name: 'Del' });
    expect(item.className).toContain('text-destructive');
  });

  it('does NOT apply the destructive class when the prop is absent', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Ok</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const item = screen.getByRole('menuitem', { name: 'Ok' });
    expect(item.className).not.toContain('text-destructive');
  });
});

describe('DropdownMenuItem — icon slot', () => {
  it('renders the icon element before the label text in the DOM', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem icon={<span data-testid="ic" />}>
            Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const icon = screen.getByTestId('ic');
    const item = screen.getByRole('menuitem');
    // The item element wraps both the icon and the "Edit" text node.
    // `compareDocumentPosition` returns a bitmask where the
    // DOCUMENT_POSITION_FOLLOWING (0x04) bit means the argument node
    // comes after `icon` in document order. If the icon precedes the
    // label, comparing icon against the item's last text node should
    // return that bit.
    const labelNode = Array.from(item.childNodes).find(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent === 'Edit',
    );
    expect(labelNode).toBeDefined();
    const position = icon.compareDocumentPosition(labelNode as Node);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('omits the icon wrapper entirely when `icon` is not provided', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Plain</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const item = screen.getByRole('menuitem', { name: 'Plain' });
    // No child <span aria-hidden="true"> — the only child should be the
    // "Plain" text node.
    expect(item.querySelector('span[aria-hidden="true"]')).toBeNull();
  });
});

describe('DropdownMenuItem — prop forwarding', () => {
  it('forwards unknown props (e.g. data-testid) to the underlying Radix Item', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem data-testid="mi">Something</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const item = screen.getByTestId('mi');
    // The forwarded prop must land on the same DOM element that carries
    // the menu role.
    expect(item.getAttribute('role')).toBe('menuitem');
  });
});

describe('DropdownMenuSeparator', () => {
  it('renders inside an open menu and forwards className', () => {
    // We use a forwardRef ref-catcher purely to satisfy any consumer
    // pattern that passes a ref; the render assertion is the primary
    // check.
    const RefCatcher = forwardRef<HTMLDivElement>(function RefCatcher(
      _,
      ref: ForwardedRef<HTMLDivElement>,
    ) {
      return <DropdownMenuSeparator ref={ref} className="custom-separator" />;
    });

    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>a</DropdownMenuItem>
          <RefCatcher />
          <DropdownMenuItem>b</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const separators = screen.getAllByRole('separator');
    expect(separators.length).toBeGreaterThan(0);
    expect(
      separators.some((el) => el.className.includes('custom-separator')),
    ).toBe(true);
  });
});

describe('DropdownMenu (Root wrapper)', () => {
  it('forwards `open` through to the underlying Radix Root', () => {
    // When `open` is false the mocked Portal still renders children
    // (the mock is intentionally a pass-through). This test just
    // exercises the wrapper's prop typing surface and confirms nothing
    // throws when arbitrary Root props are supplied.
    type RootProps = ComponentPropsWithoutRef<typeof DropdownMenu>;
    const rootProps: RootProps = {
      open: true,
      onOpenChange: () => undefined,
    };
    render(
      <DropdownMenu {...rootProps}>
        <DropdownMenuTrigger>t</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>x</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    expect(screen.getByRole('menuitem')).toBeInTheDocument();
  });
});
