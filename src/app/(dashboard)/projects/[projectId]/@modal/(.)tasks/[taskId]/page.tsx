'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { X, ExternalLink } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TaskDetailPanel } from '@/components/tasks/task-detail-panel';

interface PageProps {
  params: Promise<{ projectId: string; taskId: string }>;
}

/**
 * Intercepting route — renders the task detail as a slide-over modal
 * while keeping the board visible in the background.
 *
 * Navigating directly to the URL skips this interceptor and shows the
 * standalone task page instead.
 */
export default function TaskModalPage({ params }: PageProps) {
  const { projectId, taskId } = use(params);
  const router = useRouter();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
        onClick={() => router.back()}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Task details"
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-2xl flex-col border-l border-border bg-background shadow-2xl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3">
          <p className="text-sm font-medium text-muted-foreground">
            Task details
          </p>
          <div className="flex items-center gap-1">
            <Link
              href={`/projects/${projectId}/tasks/${taskId}`}
              aria-label="Open in full page"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <ExternalLink className="size-4" aria-hidden="true" />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close task details"
              onClick={() => router.back()}
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <TaskDetailPanel taskId={taskId} />
        </div>
      </div>
    </>
  );
}
