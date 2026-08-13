'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { Sidebar } from '@/components/layout/sidebar';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Slide-out mobile navigation drawer.
 *
 * - Renders a backdrop + the shared `Sidebar` component in a slide-in panel
 * - Traps interaction via backdrop click and Escape key
 * - Closed by clicking a link (via `Sidebar`'s `onNavClick`)
 */
export function MobileNav({ open, onClose }: MobileNavProps) {
  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  /* Prevent body scroll while open */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          'fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-out-expo md:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        <Sidebar onNavClick={onClose} />
      </div>
    </>
  );
}
