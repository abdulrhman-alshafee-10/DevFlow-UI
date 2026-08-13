'use client';

import { useState } from 'react';
import type { HTMLAttributes } from 'react';

import { getInitials, stringToHueClass } from '@/lib/utils';
import { cn } from '@/lib/utils/cn';

/**
 * Avatar size scale. Drives width, height, and text-size classes on the
 * outer container so the footprint stays stable across the image and
 * initials-fallback modes.
 */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Optional remote image URL. When omitted (or when the image fails
   * to load) the component renders the deterministic initials fallback. */
  src?: string;
  /** Full display name. Drives `alt` on the image, the accessible name
   * on the fallback (via `aria-label`), and the deterministic hue. */
  name: string;
  /** Visual size — defaults to `'md'`. */
  size?: AvatarSize;
  /** Explicit initials override. When omitted, the component derives
   * initials from `name` via `getInitials`. */
  initials?: string;
}

/**
 * Size → Tailwind class map covering width, height, and font-size for
 * every `AvatarSize`. The map lives at module scope so the same object
 * identity is reused across renders.
 */
const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

/**
 * Stable base classes for the outer container `<span>`. `text-white`
 * lives here (not on the fallback) so the initials inherit the color
 * without a second declaration, while the hue class is applied to the
 * inner fallback element only — that way a successfully-loaded image
 * never has a colored halo bleeding around its edges.
 */
const ROOT_BASE_CLASS =
  'inline-flex items-center justify-center overflow-hidden rounded-full font-medium text-white select-none';

/**
 * Circular user marker. Shows a remote image when `src` is available and
 * loads successfully; otherwise falls back to deterministic uppercase
 * initials on a per-name background hue.
 */
export function Avatar({
  src,
  name,
  size = 'md',
  initials,
  className,
  ...rest
}: AvatarProps) {
  const [errored, setErrored] = useState<boolean>(false);

  const showImage = src !== undefined && !errored;

  return (
    <span
      className={cn(ROOT_BASE_CLASS, SIZE_CLASSES[size], className)}
      {...rest}
    >
      {showImage ? (
        // Avatar images may come from arbitrary hosts (gravatar, provider
        // uploads, etc.). We deliberately use a plain `<img>` rather than
        // `next/image` so consumers don't need to allowlist every host in
        // `next.config.js`. `referrerPolicy="no-referrer"` keeps the
        // outbound request private.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <span
          aria-label={name}
          className={cn(
            'flex h-full w-full items-center justify-center',
            stringToHueClass(name),
          )}
        >
          {initials ?? getInitials(name)}
        </span>
      )}
    </span>
  );
}
