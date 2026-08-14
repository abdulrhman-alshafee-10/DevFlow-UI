'use client';

import { Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { AIStreamingBlock } from './ai-streaming-block';
import { useAIStream } from '@/hooks/use-ai-stream';
import { streamProjectSummary } from '@/lib/api/ai';

interface ProjectSummarizeButtonProps {
  projectId: string;
}

/**
 * "Summarize Project" button + streaming output block.
 *
 * Streams a status/blockers summary from the AI into an inline panel.
 */
export function ProjectSummarizeButton({
  projectId,
}: ProjectSummarizeButtonProps) {
  const { content, status, error, isStreaming, start, reset } = useAIStream();

  const handleSummarize = () => {
    if (isStreaming) {
      reset();
      return;
    }
    void start((onChunk, signal) =>
      streamProjectSummary(projectId, onChunk, signal),
    );
  };

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleSummarize}
        className="gap-1.5"
        aria-label={isStreaming ? 'Stop summary' : 'Summarize project with AI'}
      >
        <Sparkles className="size-3.5" aria-hidden="true" />
        {isStreaming ? 'Stop' : 'Summarize project'}
      </Button>

      <AIStreamingBlock
        content={content}
        status={status}
        error={error}
        label="Project Summary"
        onDismiss={reset}
      />
    </div>
  );
}
