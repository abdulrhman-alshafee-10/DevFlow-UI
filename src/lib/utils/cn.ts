import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Compose class names while intelligently resolving Tailwind conflicts.
 *
 * @example
 * cn('px-2 py-1', condition && 'bg-primary', 'px-4')
 * // -> 'py-1 bg-primary px-4'   (last `px-*` wins)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
