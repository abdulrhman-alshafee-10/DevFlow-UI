'use client';

import { MessageSquare } from 'lucide-react';

import { useComments } from '@/hooks/use-comments';
import { CommentList } from './comment-list';
import { CommentInput } from './comment-input';

interface CommentThreadProps {
  taskId: string;
}

/**
 * Full comment section — list of existing comments + new comment input.
 * Drop this into `TaskDetailPanel` to add the comments tab.
 */
export function CommentThread({ taskId }: CommentThreadProps) {
  const {
    comments,
    isLoading,
    currentUserId,
    createComment,
    isCreating,
    updateComment,
    isUpdating,
    updatingId,
    deleteComment,
    isDeleting,
    deletingId,
  } = useComments(taskId);

  function handleCreate(body: string) {
    createComment({ body });
  }

  function handleUpdate(commentId: string, body: string) {
    updateComment({ commentId, payload: { body } });
  }

  return (
    <section aria-label="Comments" className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <MessageSquare className="size-3.5" aria-hidden="true" />
        Comments
        {comments.length > 0 && (
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px]">
            {comments.length}
          </span>
        )}
      </div>

      {/* Existing comments */}
      <CommentList
        comments={comments}
        isLoading={isLoading}
        currentUserId={currentUserId}
        onUpdate={handleUpdate}
        onDelete={deleteComment}
        isUpdating={isUpdating}
        updatingId={updatingId}
        isDeleting={isDeleting}
        deletingId={deletingId}
      />

      {/* New comment input */}
      <CommentInput onSubmit={handleCreate} isPending={isCreating} />
    </section>
  );
}
