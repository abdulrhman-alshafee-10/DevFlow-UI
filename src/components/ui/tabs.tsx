'use client';

import {
  createContext,
  useContext,
  useState,
  useId,
  type ReactNode,
  type ComponentProps,
} from 'react';

import { cn } from '@/lib/utils/cn';

// ── Context ────────────────────────────────────────────────────────────────

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx)
    throw new Error('<TabsContent> / <TabsTrigger> must be inside <Tabs>');
  return ctx;
}

// ── Tabs root ──────────────────────────────────────────────────────────────

interface TabsProps {
  /** The initially active tab value. */
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

/**
 * Accessible tab container.
 *
 * Uses the ARIA `role="tablist"` / `role="tab"` / `role="tabpanel"` pattern.
 * Built from scratch to avoid pulling in `@radix-ui/react-tabs` as a new dep.
 */
export function Tabs({ defaultValue, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  const baseId = useId();

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, baseId }}>
      <div className={cn('space-y-4', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

// ── TabsList ───────────────────────────────────────────────────────────────

interface TabsListProps extends ComponentProps<'div'> {
  children: ReactNode;
}

export function TabsList({ className, children, ...props }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex h-10 items-center gap-1 rounded-lg border border-border bg-muted p-1',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ── TabsTrigger ────────────────────────────────────────────────────────────

interface TabsTriggerProps extends Omit<ComponentProps<'button'>, 'onClick'> {
  value: string;
  children: ReactNode;
}

export function TabsTrigger({
  value,
  className,
  children,
  ...props
}: TabsTriggerProps) {
  const { activeTab, setActiveTab, baseId } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-controls={`${baseId}-panel-${value}`}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      onClick={() => setActiveTab(value)}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
        isActive
          ? 'bg-background text-foreground shadow-soft'
          : 'text-muted-foreground hover:text-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// ── TabsContent ────────────────────────────────────────────────────────────

interface TabsContentProps extends ComponentProps<'div'> {
  value: string;
  children: ReactNode;
}

export function TabsContent({
  value,
  className,
  children,
  ...props
}: TabsContentProps) {
  const { activeTab, baseId } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      hidden={!isActive}
      tabIndex={0}
      className={cn(
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
        className,
      )}
      {...props}
    >
      {isActive ? children : null}
    </div>
  );
}
