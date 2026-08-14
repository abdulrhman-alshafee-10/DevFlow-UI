import { MessageSquare } from 'lucide-react';

import { Spinner } from '@/components/ui/spinner';
import { CommentItem } from './comment-item';
import type { Comment } from '@/lib/api/comments';

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
  currentUserId?: string;
  onUpdate: (commentId: string, body: string) => void;
  onDelete: (commentId: string) => void;
  isUpdating?: boolean;
  updatingId?: string;
  isDeleting?: boolean;
  deletingId?: string;
}

/**
 * Scrollable list of comment items with loading and empty states.
 */
export function CommentList({
  comments,
  isLoading,
  currentUserId,
  onUpdate,
  onDelete,
  isUpdating,
  updatingId,
  isDeleting,
  deletingId,
}: CommentListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Spinner label="Loading comments" />
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
        <MessageSquare className="size-6 opacity-40" aria-hidden="true" />
        <p className="text-xs">No comments yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isOwnComment={comment.authorId === currentUserId}
          onUpdate={onUpdate}
          onDelete={onDelete}
          isUpdating={isUpdating && updatingId === comment.id}
          isDeleting={isDeleting && deletingId === comment.id}
        />
      ))}
    </div>
  );
}
