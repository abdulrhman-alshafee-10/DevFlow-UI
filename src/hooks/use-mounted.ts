'use client';

import { useEffect, useState } from 'react';

/**
 * Returns `true` once the component has mounted on the client.
 *
 * Useful to avoid hydration mismatches when rendering UI that
 * depends on client-only state (e.g. the current theme).
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
