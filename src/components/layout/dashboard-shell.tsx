'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { WebSocketProvider } from '@/components/layout/websocket-provider';

interface DashboardShellProps {
  children: ReactNode;
}

/**
 * Client component that owns mobile nav open/close state.
 * Also mounts the WebSocketProvider so realtime sync is active across
 * the entire dashboard session.
 */
export function DashboardShell({ children }: DashboardShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {/* Realtime WebSocket sync — renders nothing, manages socket lifecycle */}
      <WebSocketProvider />

      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden md:flex md:shrink-0">
        <Sidebar />
      </div>

      {/* Mobile slide-out drawer */}
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* Main content column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />

        <main id="main-content" className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
