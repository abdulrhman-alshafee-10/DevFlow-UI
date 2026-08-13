import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from './badge';

/**
 * Unit tests for `<Badge />` covering the legacy `variant` prop as well as
 * the domain-aware `priority` / `status` props, the `icon` slot, and the
 * design-locked precedence contract implemented by `resolveBadgeVariant`.
 *
 * Requirements: 2.1, 2.5, 2.6, 2.9, 2.10
 */
describe('<Badge />', () => {
  it('renders the legacy `variant="info"` classes unchanged', () => {
    render(<Badge variant="info">Info</Badge>);

    const badge = screen.getByText('Info');
    // One of the tokens from the `info` variant string.
    expect(badge).toHaveClass('bg-info/15');
  });

  it('renders `priority="urgent"` with the destructive variant', () => {
    render(<Badge priority="urgent">Urgent</Badge>);

    const badge = screen.getByText('Urgent');
    expect(badge).toHaveClass('bg-destructive');
  });

  it('renders `status="in_progress"` with the info variant', () => {
    render(<Badge status="in_progress">In progress</Badge>);

    const badge = screen.getByText('In progress');
    expect(badge).toHaveClass('bg-info/15');
  });

  it('renders `status="done"` with the success variant', () => {
    render(<Badge status="done">Done</Badge>);

    const badge = screen.getByText('Done');
    expect(badge).toHaveClass('bg-success/15');
  });

  it('renders no domain props with the default variant', () => {
    render(<Badge>Plain</Badge>);

    const badge = screen.getByText('Plain');
    expect(badge).toHaveClass('bg-primary');
  });

  it('renders `icon` before the label text', () => {
    render(<Badge icon={<span data-testid="badge-icon" />}>Label</Badge>);

    const icon = screen.getByTestId('badge-icon');
    // The icon lives inside the aria-hidden wrapper, which is the first
    // child of the badge span. The label text follows.
    const iconWrapper = icon.parentElement;
    expect(iconWrapper).not.toBeNull();
    expect(iconWrapper).toHaveAttribute('aria-hidden', 'true');

    const badge = iconWrapper?.parentElement;
    expect(badge).not.toBeNull();
    expect(badge?.firstChild).toBe(iconWrapper);

    // Confirm the icon element itself precedes the "Label" text node in
    // document order.
    const label = badge?.lastChild;
    expect(label?.textContent).toBe('Label');
    // eslint-disable-next-line no-bitwise -- compareDocumentPosition uses a bitmask
    expect(
      icon.compareDocumentPosition(label as Node) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('renders the root element as a <span>', () => {
    render(<Badge>Root</Badge>);

    const badge = screen.getByText('Root');
    expect(badge.tagName).toBe('SPAN');
  });

  it('respects precedence: priority > status > variant', () => {
    render(
      <Badge priority="urgent" status="done" variant="info">
        Precedence
      </Badge>,
    );

    const badge = screen.getByText('Precedence');
    // Priority `urgent` → destructive variant wins over both status `done`
    // (which would resolve to `success`) and variant `info`.
    expect(badge).toHaveClass('bg-destructive');
    expect(badge).not.toHaveClass('bg-success/15');
    expect(badge).not.toHaveClass('bg-info/15');
  });
});
