'use client';

import { useState } from 'react';
import { Sparkles, Plus, CheckSquare } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/toast';
import { suggestSubtasks } from '@/lib/api/ai';
import type { SubtaskSuggestion } from '@/lib/api/ai';
import type { Priority } from '@/types';

interface SuggestSubtasksButtonProps {
  taskId: string;
  projectId: string;
  /** Called for each subtask the user confirms. */
  onCreateSubtask: (payload: {
    title: string;
    description: string;
    priority: Priority;
  }) => Promise<void>;
}

/**
 * "Generate Subtasks" button.
 *
 * Calls the JSON (non-streaming) subtask suggestion endpoint, renders the
 * suggestions as clickable cards, and lets the user create individual ones
 * or create all at once.
 */
export function SuggestSubtasksButton({
  taskId,
  projectId: _projectId,
  onCreateSubtask,
}: SuggestSubtasksButtonProps) {
  const [suggestions, setSuggestions] = useState<SubtaskSuggestion[]>([]);
  const [creating, setCreating] = useState<Set<number>>(new Set());
  const [created, setCreated] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingAll, setIsCreatingAll] = useState(false);

  const handleFetch = async () => {
    setIsLoading(true);
    setSuggestions([]);
    setCreated(new Set());
    try {
      const results = await suggestSubtasks(taskId);
      setSuggestions(results);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Could not generate subtasks.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (index: number) => {
    const s = suggestions[index];
    if (!s || created.has(index)) return;

    setCreating((prev) => new Set(prev).add(index));
    try {
      await onCreateSubtask({
        title: s.title,
        description: s.description,
        priority: (s.priority as Priority) ?? 'medium',
      });
      setCreated((prev) => new Set(prev).add(index));
    } catch {
      toast.error(`Could not create subtask "${s.title}".`);
    } finally {
      setCreating((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }
  };

  const handleCreateAll = async () => {
    setIsCreatingAll(true);
    const pending = suggestions.map((_, i) => i).filter((i) => !created.has(i));
    for (const i of pending) {
      await handleCreate(i);
    }
    setIsCreatingAll(false);
    toast.success('All subtasks created.');
  };

  const allCreated =
    suggestions.length > 0 && suggestions.every((_, i) => created.has(i));

  return (
    <div className="space-y-3">
      {/* Trigger */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleFetch}
        disabled={isLoading}
        className="gap-1.5"
        aria-label="Generate subtask suggestions with AI"
      >
        {isLoading ? (
          <Spinner className="size-3.5" label="Generating" />
        ) : (
          <Sparkles className="size-3.5" aria-hidden="true" />
        )}
        {isLoading ? 'Generating…' : 'Generate subtasks'}
      </Button>

      {/* Suggestion cards */}
      {suggestions.length > 0 && (
        <div className="space-y-2 rounded-lg border border-border bg-muted/40 p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              AI Suggestions
            </p>
            {!allCreated && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 gap-1 text-xs"
                onClick={handleCreateAll}
                disabled={isCreatingAll}
                aria-label="Create all suggested subtasks"
              >
                {isCreatingAll ? (
                  <Spinner className="size-3" label="Creating all" />
                ) : (
                  <Plus className="size-3" aria-hidden="true" />
                )}
                Create all
              </Button>
            )}
          </div>

          <ul className="space-y-1.5" aria-label="Suggested subtasks">
            {suggestions.map((s, i) => {
              const isCreatingThis = creating.has(i);
              const isCreated = created.has(i);

              return (
                <li
                  key={i}
                  className={cn(
                    'flex items-start gap-2.5 rounded-md border p-2.5 text-sm transition-colors',
                    isCreated
                      ? 'border-success/30 bg-success/5 opacity-60'
                      : 'border-border bg-background hover:bg-muted/50',
                  )}
                >
                  <CheckSquare
                    className={cn(
                      'mt-0.5 size-3.5 shrink-0',
                      isCreated ? 'text-success' : 'text-muted-foreground',
                    )}
                    aria-hidden="true"
                  />

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="font-medium leading-snug">{s.title}</p>
                    {s.description && (
                      <p className="text-xs leading-snug text-muted-foreground">
                        {s.description}
                      </p>
                    )}
                    <Badge
                      priority={s.priority as Priority}
                      className="mt-1 text-[10px]"
                    >
                      {s.priority}
                    </Badge>
                  </div>

                  {!isCreated && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 shrink-0"
                      onClick={() => handleCreate(i)}
                      disabled={isCreatingThis || isCreatingAll}
                      aria-label={`Create subtask: ${s.title}`}
                    >
                      {isCreatingThis ? (
                        <Spinner className="size-3" label="Creating" />
                      ) : (
                        <Plus className="size-3.5" aria-hidden="true" />
                      )}
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>

          {allCreated && (
            <p className="py-1 text-center text-xs text-muted-foreground">
              All subtasks created ✓
            </p>
          )}
        </div>
      )}
    </div>
  );
}
