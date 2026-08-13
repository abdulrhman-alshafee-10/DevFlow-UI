import type { Metadata } from 'next';
import { LayoutDashboard } from 'lucide-react';

export const metadata: Metadata = { title: 'Dashboard' };

export default function DashboardPage() {
  return (
    <div className="animate-fade-in-up space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your projects, tasks, and activity.
        </p>
      </div>

      {/* Placeholder stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Open tasks', value: '—' },
          { label: 'Active projects', value: '—' },
          { label: 'Team members', value: '—' },
          { label: 'Completed today', value: '—' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Placeholder content area */}
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card text-muted-foreground">
        <LayoutDashboard className="size-8 opacity-40" aria-hidden="true" />
        <p className="text-sm">Dashboard content coming in a later phase.</p>
      </div>
    </div>
  );
}
