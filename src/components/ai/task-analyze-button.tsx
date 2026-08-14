'use client';

import { Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { AIStreamingBlock } from './ai-streaming-block';
import { useAIStream } from '@/hooks/use-ai-stream';
import { streamTaskAnalysis } from '@/lib/api/ai';

interface TaskAnalyzeButtonProps {
  taskId: string;
}

/**
 * "Analyze Task" button + streaming output block.
 *
 * Streams a complexity/risk breakdown from the AI into an inline
 * panel directly beneath the button.
 */
export function TaskAnalyzeButton({ taskId }: TaskAnalyzeButtonProps) {
  const { content, status, error, isStreaming, start, reset } = useAIStream();

  const handleAnalyze = () => {
    if (isStreaming) {
      reset();
      return;
    }
    void start((onChunk, signal) =>
      streamTaskAnalysis(taskId, onChunk, signal),
    );
  };

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleAnalyze}
        className="gap-1.5"
        aria-label={isStreaming ? 'Stop analysis' : 'Analyze task with AI'}
      >
        <Sparkles className="size-3.5" aria-hidden="true" />
        {isStreaming ? 'Stop' : 'Analyze task'}
      </Button>

      <AIStreamingBlock
        content={content}
        status={status}
        error={error}
        label="Task Analysis"
        onDismiss={reset}
      />
    </div>
  );
}
