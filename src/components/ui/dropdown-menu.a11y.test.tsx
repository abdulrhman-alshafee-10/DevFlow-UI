import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

/**
 * Radix owns the keyboard behavior for menus (roving `tabindex`, focus
 * return, arrow-key navigation, activation via Enter/Space, Escape to
 * close). Our compound wrapper must not override any of it. These
 * integration tests act as a regression guard: if the wrapper ever
 * silently intercepts one of those events, one of these assertions
 * fails.
 *
 * Notes on jsdom limitations:
 *  - jsdom implements pointer / keyboard event dispatch but its layout
 *    engine is a no-op. Radix's `pointer-outside` heuristics can be
 *    finicky as a result, so we prefer keyboard-driven flows where
 *    possible and wrap potentially async assertions in `waitFor`.
 */

// Small helper — a controlled fixture keeps the tests deterministic and
// lets each case start from a known closed state.
function Fixture({
  onSelect,
}: {
  onSelect?: (label: string) => void;
} = {}): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => onSelect?.('one')}>
          Item One
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onSelect?.('two')}>
          Item Two
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onSelect?.('three')}>
          Item Three
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe('DropdownMenu — opening the menu', () => {
  it('opens when the trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<Fixture />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });

  it('opens when Enter is pressed on the focused trigger', async () => {
    const user = userEvent.setup();
    render(<Fixture />);
    const trigger = screen.getByRole('button', { name: 'Open menu' });
    trigger.focus();
    await user.keyboard('{Enter}');
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });

  it('opens when Space is pressed on the focused trigger', async () => {
    const user = userEvent.setup();
    render(<Fixture />);
    const trigger = screen.getByRole('button', { name: 'Open menu' });
    trigger.focus();
    await user.keyboard(' ');
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });

  it('opens when ArrowDown is pressed on the focused trigger', async () => {
    const user = userEvent.setup();
    render(<Fixture />);
    const trigger = screen.getByRole('button', { name: 'Open menu' });
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });
});

describe('DropdownMenu — arrow-key navigation among items', () => {
  it('moves focus with ArrowDown / ArrowUp / Home / End', async () => {
    const user = userEvent.setup();
    render(<Fixture />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    const items = screen.getAllByRole('menuitem');
    expect(items).toHaveLength(3);

    // Opening with a pointer may not auto-focus the first item under
    // jsdom's layout engine, so we push focus down explicitly and let
    // Radix's roving tabindex take over.
    await user.keyboard('{ArrowDown}');
    await waitFor(() => {
      expect(document.activeElement).toBe(items[0]);
    });

    await user.keyboard('{ArrowDown}');
    await waitFor(() => {
      expect(document.activeElement).toBe(items[1]);
    });

    await user.keyboard('{ArrowUp}');
    await waitFor(() => {
      expect(document.activeElement).toBe(items[0]);
    });

    await user.keyboard('{End}');
    await waitFor(() => {
      expect(document.activeElement).toBe(items[2]);
    });

    await user.keyboard('{Home}');
    await waitFor(() => {
      expect(document.activeElement).toBe(items[0]);
    });
  });
});

describe('DropdownMenu — activating a focused item', () => {
  it('fires onSelect and closes the content when Enter is pressed', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn<(label: string) => void>();
    render(<Fixture onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(onSelect).toHaveBeenCalledWith('one');
    });
    await waitFor(() => {
      expect(screen.queryByRole('menu')).toBeNull();
    });
  });

  it('fires onSelect and closes the content when Space is pressed', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn<(label: string) => void>();
    render(<Fixture onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}');
    await user.keyboard(' ');

    await waitFor(() => {
      expect(onSelect).toHaveBeenCalledWith('two');
    });
    await waitFor(() => {
      expect(screen.queryByRole('menu')).toBeNull();
    });
  });
});

describe('DropdownMenu — Escape behavior', () => {
  it('closes the menu and restores focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Fixture />);

    const trigger = screen.getByRole('button', { name: 'Open menu' });
    await user.click(trigger);
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('menu')).toBeNull();
    });
    // jsdom limitation: focus restore relies on the same element still
    // being in the DOM tree at the moment Radix reads it — that's true
    // here because our fixture keeps the trigger mounted.
    await waitFor(() => {
      expect(document.activeElement).toBe(trigger);
    });
  });
});
