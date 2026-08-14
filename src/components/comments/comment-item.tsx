'use client';

import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MarkdownContent } from './markdown-content';
import { CommentInput } from './comment-input';
import type { Comment } from '@/lib/api/comments';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface CommentItemProps {
  comment: Comment;
  isOwnComment: boolean;
  onUpdate: (commentId: string, body: string) => void;
  onDelete: (commentId: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

/**
 * Single comment bubble with avatar, markdown body, and owner-only
 * edit/delete actions.
 */
export function CommentItem({
  comment,
  isOwnComment,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: CommentItemProps) {
  const [editing, setEditing] = useState(false);
  const isOptimistic = comment.id.startsWith('optimistic-');

  function handleSave(body: string) {
    onUpdate(comment.id, body);
    setEditing(false);
  }

  return (
    <div
      className={`group flex gap-3 ${isOptimistic ? 'animate-pulse opacity-70' : ''}`}
    >
      {/* Avatar */}
      <Avatar
        src={comment.authorAvatarUrl ?? undefined}
        name={comment.authorDisplayName}
        size="sm"
        className="mt-0.5 shrink-0"
      />

      {/* Body */}
      <div className="min-w-0 flex-1 space-y-1">
        {/* Author + timestamp */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {comment.authorDisplayName}
            </span>
            <time
              dateTime={comment.createdAt}
              className="text-xs text-muted-foreground"
              title={new Date(comment.createdAt).toLocaleString()}
            >
              {timeAgo(comment.createdAt)}
            </time>
            {comment.editedAt && (
              <span className="text-[10px] italic text-muted-foreground">
                (edited)
              </span>
            )}
          </div>

          {/* Actions — own comments only */}
          {isOwnComment && !isOptimistic && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Comment actions"
                  className="h-6 w-6 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <MoreHorizontal className="size-3.5" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={() => setEditing(true)}
                  disabled={isUpdating}
                >
                  <Pencil className="size-4" aria-hidden="true" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => onDelete(comment.id)}
                  disabled={isDeleting}
                  destructive
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Edit mode or rendered markdown */}
        {editing ? (
          <CommentInput
            defaultValue={comment.body}
            onSubmit={handleSave}
            isPending={isUpdating}
            submitLabel="Save"
            onCancel={() => setEditing(false)}
            autoFocus
          />
        ) : (
          <div className="rounded-lg border border-border bg-muted/20 px-3 py-2.5">
            <MarkdownContent>{comment.body}</MarkdownContent>
          </div>
        )}
      </div>
    </div>
  );
}
