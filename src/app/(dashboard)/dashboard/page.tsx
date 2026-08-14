'use client';

import { CheckSquare, FolderKanban, Users, CheckCircle2 } from 'lucide-react';

import { useUser } from '@/hooks/use-user';
import { StatCard } from '@/components/dashboard/stat-card';
import { TasksDueSoon } from '@/components/dashboard/tasks-due-soon';
import { RecentProjects } from '@/components/dashboard/recent-projects';
import { useAuth } from '@/hooks/use-auth';

export default function DashboardPage() {
  const { user } = useAuth();
  const { metrics, isLoadingMetrics, metricsError } = useUser();

  const greeting = user?.displayName
    ? `Welcome back, ${user.displayName.split(' ')[0]}`
    : 'Welcome back';

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{greeting}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s an overview of your current workload.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Open tasks"
          value={metrics?.openTasks}
          icon={CheckSquare}
          iconColor="bg-blue-500/10"
          iconTextColor="text-blue-500"
          isLoading={isLoadingMetrics}
        />
        <StatCard
          label="Active projects"
          value={metrics?.activeProjects}
          icon={FolderKanban}
          iconColor="bg-violet-500/10"
          iconTextColor="text-violet-500"
          isLoading={isLoadingMetrics}
        />
        <StatCard
          label="Team members"
          value={metrics?.teamMembers}
          icon={Users}
          iconColor="bg-emerald-500/10"
          iconTextColor="text-emerald-500"
          isLoading={isLoadingMetrics}
        />
        <StatCard
          label="Completed today"
          value={metrics?.completedToday}
          icon={CheckCircle2}
          iconColor="bg-amber-500/10"
          iconTextColor="text-amber-500"
          isLoading={isLoadingMetrics}
        />
      </div>

      {/* Widgets row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TasksDueSoon
          tasks={metrics?.tasksDueSoon}
          isLoading={isLoadingMetrics}
          hasError={!!metricsError}
        />
        <RecentProjects
          projects={metrics?.recentProjects}
          isLoading={isLoadingMetrics}
          hasError={!!metricsError}
        />
      </div>
    </div>
  );
}
