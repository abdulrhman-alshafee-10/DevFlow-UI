import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';
import { Label } from '@/components/ui/label';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Visible label above the input. */
  label?: string;
  /** Marks the field as required (adds asterisk, sets `aria-required`). */
  required?: boolean;
  /** Helper text shown below the input in normal state. */
  helperText?: string;
  /** Error message. When present, the input renders in error state. */
  error?: string;
  /** Icon rendered inside the input on the left. */
  leftIcon?: ReactNode;
  /** Icon rendered inside the input on the right. */
  rightIcon?: ReactNode;
  /** Extra class names for the wrapping container. */
  containerClassName?: string;
}

/**
 * Accessible text input with label, helper text, and error support.
 *
 * IDs and `aria-describedby` are wired up automatically so screen
 * readers announce helper text and errors correctly.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      required,
      helperText,
      error,
      leftIcon,
      rightIcon,
      className,
      containerClassName,
      type = 'text',
      disabled,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;
    const hasError = Boolean(error);

    const describedBy =
      [
        hasError ? errorId : null,
        helperText && !hasError ? helperId : null,
        props['aria-describedby'],
      ]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
      <div className={cn('flex w-full flex-col gap-1.5', containerClassName)}>
        {label ? (
          <Label htmlFor={inputId} required={required}>
            {label}
          </Label>
        ) : null}

        <div className="relative">
          {leftIcon ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground [&_svg]:size-4"
            >
              {leftIcon}
            </span>
          ) : null}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            required={required}
            aria-invalid={hasError || undefined}
            aria-required={required || undefined}
            aria-describedby={describedBy}
            className={cn(
              // Base
              'flex h-10 w-full rounded-md border bg-background text-sm text-foreground',
              'transition-colors placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
              // Padding — adjusts for icons
              leftIcon ? 'pl-9' : 'pl-3',
              rightIcon ? 'pr-9' : 'pr-3',
              'py-2',
              // Border color reflects state
              hasError
                ? 'border-destructive focus-visible:ring-destructive'
                : 'border-input',
              className,
            )}
            {...props}
          />

          {rightIcon ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground [&_svg]:size-4"
            >
              {rightIcon}
            </span>
          ) : null}
        </div>

        {hasError ? (
          <p id={errorId} className="text-xs font-medium text-destructive">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-muted-foreground">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
