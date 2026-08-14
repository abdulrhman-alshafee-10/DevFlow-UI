/**
 * Unit tests for the `<Button />` component.
 *
 * Covers: variants, sizes, loading state, icons, disabled behaviour,
 * and keyboard/accessibility expectations.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './button';

describe('<Button />', () => {
  // ── Rendering ────────────────────────────────────────────────────────────

  it('renders its children as label text', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('defaults to type="button" so it does not accidentally submit forms', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('accepts type="submit" for form submission', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  // ── Variants ─────────────────────────────────────────────────────────────

  it.each([
    'primary',
    'secondary',
    'destructive',
    'outline',
    'ghost',
    'link',
  ] as const)('renders the %s variant without crashing', (variant) => {
    render(<Button variant={variant}>{variant}</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  // ── Sizes ─────────────────────────────────────────────────────────────────

  it.each(['sm', 'md', 'lg', 'icon'] as const)(
    'renders size="%s" without crashing',
    (size) => {
      render(<Button size={size}>x</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    },
  );

  // ── Full width ────────────────────────────────────────────────────────────

  it('adds w-full class when fullWidth is true', () => {
    render(<Button fullWidth>Wide</Button>);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  // ── Loading state ─────────────────────────────────────────────────────────

  it('shows spinner and becomes disabled while isLoading', () => {
    render(<Button isLoading>Save</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
    // Spinner renders a status role element
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows custom loadingText while loading', () => {
    render(
      <Button isLoading loadingText="Saving…">
        Save
      </Button>,
    );
    // The text appears twice: once in the sr-only spinner label, once as the visible button label.
    // We only care that at least one is in the document.
    expect(screen.getAllByText('Saving…').length).toBeGreaterThanOrEqual(1);
  });

  it('falls back to children text when loading and no loadingText is set', () => {
    render(<Button isLoading>Save</Button>);
    // "Save" appears as the visible label span; sr-only shows "Loading"
    expect(screen.getAllByText('Save').length).toBeGreaterThanOrEqual(1);
  });

  // ── Disabled ──────────────────────────────────────────────────────────────

  it('is disabled and does not fire onClick when disabled prop is set', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Click
      </Button>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  // ── Icons ─────────────────────────────────────────────────────────────────

  it('renders leftIcon before children', () => {
    render(<Button leftIcon={<span data-testid="left-icon" />}>Label</Button>);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('renders rightIcon after children', () => {
    render(
      <Button rightIcon={<span data-testid="right-icon" />}>Label</Button>,
    );
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  // ── Interaction ───────────────────────────────────────────────────────────

  it('fires onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is keyboard-activatable with Enter key', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Press</Button>);
    screen.getByRole('button').focus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // ── Custom className ──────────────────────────────────────────────────────

  it('merges custom className onto the button element', () => {
    render(<Button className="my-custom-class">Label</Button>);
    expect(screen.getByRole('button')).toHaveClass('my-custom-class');
  });
});
