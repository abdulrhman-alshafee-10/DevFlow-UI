import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './button';
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalTitle,
  ModalTrigger,
} from './modal';

/**
 * Radix Dialog owns the modal keyboard/focus contract:
 *  - Trigger activates on click, Enter, Space (via the underlying
 *    `<button>` semantics).
 *  - Escape while open closes the dialog.
 *  - Pointer-down outside the content closes the dialog.
 *  - Focus is trapped inside the content while open.
 *  - Focus returns to the trigger on close.
 *
 * These integration tests verify our compound wrapper does not
 * regress any of that behavior. jsdom has no layout engine, so we
 * lean on keyboard-driven flows where possible and wrap async
 * assertions in `waitFor`.
 */

// A controlled fixture keeps each test deterministic and makes the
// `onOpenChange` interception assertions clean. Radix `Trigger` and
// `Close` render `<button>` elements by default, so we don't need
// `asChild` here.
function ControlledFixture({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}): JSX.Element {
  return (
    <Modal onOpenChange={onOpenChange}>
      <ModalTrigger>Open modal</ModalTrigger>
      <ModalContent>
        <ModalTitle>Modal title</ModalTitle>
        <ModalDescription>Modal body</ModalDescription>
        <Button data-testid="first-focusable">first</Button>
        <Button data-testid="middle-focusable">middle</Button>
        <ModalClose data-testid="last-focusable">Close</ModalClose>
      </ModalContent>
    </Modal>
  );
}

describe('Modal — trigger activation', () => {
  it('opens on click', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn<(open: boolean) => void>();
    render(<ControlledFixture onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole('button', { name: 'Open modal' }));
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('opens on Enter', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn<(open: boolean) => void>();
    render(<ControlledFixture onOpenChange={onOpenChange} />);

    const trigger = screen.getByRole('button', { name: 'Open modal' });
    trigger.focus();
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('opens on Space', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn<(open: boolean) => void>();
    render(<ControlledFixture onOpenChange={onOpenChange} />);

    const trigger = screen.getByRole('button', { name: 'Open modal' });
    trigger.focus();
    await user.keyboard(' ');

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });
});

describe('Modal — dismissal behavior', () => {
  it('calls onOpenChange(false) when Escape is pressed while open', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn<(open: boolean) => void>();
    render(<ControlledFixture onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole('button', { name: 'Open modal' }));
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      // Last invocation should be the close signal.
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
    });
  });

  it('calls onOpenChange(false) when the user points down outside the content', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn<(open: boolean) => void>();
    render(<ControlledFixture onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole('button', { name: 'Open modal' }));
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    // The portaled overlay is the "outside" surface — a pointer-down on
    // it triggers Radix's outside-close heuristic.
    const overlay = screen.getByTestId('modal-overlay');
    await user.pointer([
      { keys: '[MouseLeft>]', target: overlay },
      { keys: '[/MouseLeft]', target: overlay },
    ]);

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
    });
  });
});

describe('Modal — focus management', () => {
  it('traps focus inside the content when Tab reaches the last focusable', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn<(open: boolean) => void>();
    render(<ControlledFixture onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole('button', { name: 'Open modal' }));
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const first = screen.getByTestId('first-focusable');
    const middle = screen.getByTestId('middle-focusable');
    const last = screen.getByTestId('last-focusable');

    // Explicitly seed focus at the last focusable — jsdom doesn't
    // always match Radix's initial auto-focus target under portaled
    // content, so we assert only the wrapping behavior (Tab-from-last
    // goes back into the dialog).
    last.focus();
    expect(document.activeElement).toBe(last);

    await user.tab();

    await waitFor(() => {
      // Focus must not have escaped to <body> or the trigger; it must
      // wrap to another focusable inside the dialog.
      const active = document.activeElement;
      expect(active).not.toBe(document.body);
      expect([first, middle, last]).toContain(active as HTMLElement);
    });
  });

  it('returns focus to the trigger when the modal closes', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn<(open: boolean) => void>();
    render(<ControlledFixture onOpenChange={onOpenChange} />);

    const trigger = screen.getByRole('button', { name: 'Open modal' });
    await user.click(trigger);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
    await waitFor(() => {
      expect(document.activeElement).toBe(trigger);
    });
  });
});
