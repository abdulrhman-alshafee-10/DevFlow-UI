import { Loader2 } from 'lucide-react';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils/cn';

export interface SpinnerProps extends ComponentProps<'svg'> {
  /** Screen-reader label for accessibility. Defaults to "Loading". */
  label?: string;
}

/**
 * Accessible loading spinner backed by Lucide's `Loader2` icon.
 *
 * Renders an animated SVG with `role="status"` semantics via the
 * `aria-hidden` icon + visually hidden text pattern.
 */
export function Spinner({
  className,
  label = 'Loading',
  ...props
}: SpinnerProps) {
  return (
    <span role="status" className="inline-flex items-center">
      <Loader2
        className={cn('h-4 w-4 animate-spin', className)}
        aria-hidden="true"
        {...props}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
