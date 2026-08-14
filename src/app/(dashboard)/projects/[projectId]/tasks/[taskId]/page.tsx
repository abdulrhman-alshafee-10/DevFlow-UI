'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { TaskDetailPanel } from '@/components/tasks/task-detail-panel';

interface PageProps {
  params: Promise<{ projectId: string; taskId: string }>;
}

/**
 * Standalone task detail page.
 *
 * Shown when the user navigates directly to the URL (e.g. via a shared
 * link or opening the intercepted modal in a new tab).
 */
export default function TaskDetailPage({ params }: PageProps) {
  const { projectId, taskId } = use(params);

  return (
    <div className="animate-fade-in-up space-y-5">
      {/* Back link */}
      <Link
        href={`/projects/${projectId}`}
        className="inline-flex h-8 items-center gap-2 rounded-md px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to board
      </Link>

      <TaskDetailPanel taskId={taskId} />
    </div>
  );
}
