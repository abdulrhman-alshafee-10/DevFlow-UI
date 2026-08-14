/**
 * Unit tests for the `<Input />` component.
 *
 * Covers: label association, helper text, error state, icons,
 * required marking, and accessibility wiring.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Input } from './input';

describe('<Input />', () => {
  // ── Basic rendering ───────────────────────────────────────────────────────

  it('renders an input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('defaults to type="text"', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
  });

  it('accepts and forwards arbitrary input props (placeholder, maxLength)', () => {
    render(<Input placeholder="Enter value" maxLength={50} />);
    const input = screen.getByPlaceholderText('Enter value');
    expect(input).toHaveAttribute('maxlength', '50');
  });

  // ── Label ─────────────────────────────────────────────────────────────────

  it('renders a visible label when label prop is provided', () => {
    render(<Input label="Email address" />);
    expect(screen.getByText('Email address')).toBeInTheDocument();
  });

  it('associates the label with the input via htmlFor / id', () => {
    render(<Input label="Email address" id="email" />);
    const input = screen.getByLabelText('Email address');
    expect(input).toBeInTheDocument();
  });

  it('renders no label element when label prop is omitted', () => {
    render(<Input placeholder="no label" />);
    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  // ── Required ──────────────────────────────────────────────────────────────

  it('sets aria-required when required prop is true', () => {
    render(<Input label="Name" required />);
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-required',
      'true',
    );
  });

  // ── Helper text ───────────────────────────────────────────────────────────

  it('shows helperText below the input', () => {
    render(<Input helperText="We'll never share your email." />);
    expect(
      screen.getByText("We'll never share your email."),
    ).toBeInTheDocument();
  });

  it('connects helperText to input via aria-describedby', () => {
    render(<Input id="email" helperText="Helpful hint" />);
    const input = screen.getByRole('textbox');
    const helperId = input.getAttribute('aria-describedby');
    expect(helperId).toBeTruthy();
    const helperEl = document.getElementById(helperId!);
    expect(helperEl).toHaveTextContent('Helpful hint');
  });

  // ── Error state ───────────────────────────────────────────────────────────

  it('renders the error message when error prop is provided', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('sets aria-invalid when an error is present', () => {
    render(<Input error="Bad value" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when there is no error', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  });

  it('hides helperText when an error is also present', () => {
    render(<Input helperText="Helper" error="Error message" />);
    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  // ── Icons ─────────────────────────────────────────────────────────────────

  it('renders leftIcon inside the input wrapper', () => {
    render(<Input leftIcon={<span data-testid="left-icon" />} />);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('renders rightIcon inside the input wrapper', () => {
    render(<Input rightIcon={<span data-testid="right-icon" />} />);
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  // ── Disabled ──────────────────────────────────────────────────────────────

  it('is disabled and does not fire onChange when disabled', async () => {
    const onChange = vi.fn();
    render(<Input disabled onChange={onChange} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    await userEvent.type(input, 'hello');
    expect(onChange).not.toHaveBeenCalled();
  });

  // ── User typing ───────────────────────────────────────────────────────────

  it('updates value as the user types', async () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'DevFlow');
    expect(input).toHaveValue('DevFlow');
  });
});
