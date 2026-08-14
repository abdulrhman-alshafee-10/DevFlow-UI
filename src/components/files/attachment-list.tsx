'use client';

import { Download, Trash2, AlertCircle } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { buttonVariants } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { FileIcon } from './file-icon';
import type { Attachment, UploadState } from '@/types/attachment';

// ── Helpers ────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Upload progress row ────────────────────────────────────────────────────

function UploadProgressRow({ upload }: { upload: UploadState }) {
  return (
    <li className="flex items-center gap-3 rounded-md border border-border bg-muted/40 px-3 py-2">
      <FileIcon
        mimeType={upload.file.type}
        className="size-4 shrink-0 text-muted-foreground"
      />

      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate text-xs font-medium">{upload.file.name}</p>

        {upload.status === 'error' ? (
          <p className="flex items-center gap-1 text-xs text-destructive">
            <AlertCircle className="size-3" aria-hidden="true" />
            Upload failed
          </p>
        ) : (
          <div
            role="progressbar"
            aria-valuenow={upload.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Uploading ${upload.file.name}`}
            className="h-1 w-full overflow-hidden rounded-full bg-muted"
          >
            <div
              className={cn(
                'h-full rounded-full transition-all duration-200',
                upload.status === 'done' ? 'bg-success' : 'bg-primary',
              )}
              style={{ width: `${upload.progress}%` }}
            />
          </div>
        )}
      </div>

      {upload.status === 'uploading' && (
        <Spinner className="size-3.5 shrink-0" label="Uploading" />
      )}
    </li>
  );
}

// ── Saved attachment row ───────────────────────────────────────────────────

interface AttachmentRowProps {
  attachment: Attachment;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

function AttachmentRow({
  attachment,
  onDelete,
  isDeleting,
}: AttachmentRowProps) {
  return (
    <li className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2 transition-colors hover:bg-muted/40">
      <FileIcon
        mimeType={attachment.mimeType}
        className="size-4 shrink-0 text-muted-foreground"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium">{attachment.filename}</p>
        <p className="text-xs text-muted-foreground">
          {formatBytes(attachment.size)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <a
          href={attachment.url}
          download={attachment.filename}
          aria-label={`Download ${attachment.filename}`}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'size-7',
          )}
        >
          <Download className="size-3.5" aria-hidden="true" />
        </a>

        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground hover:text-destructive"
          aria-label={`Delete ${attachment.filename}`}
          disabled={isDeleting}
          onClick={() => onDelete(attachment.id)}
        >
          {isDeleting ? (
            <Spinner className="size-3.5" label="Deleting" />
          ) : (
            <Trash2 className="size-3.5" aria-hidden="true" />
          )}
        </Button>
      </div>
    </li>
  );
}

// ── List component ─────────────────────────────────────────────────────────

interface AttachmentListProps {
  attachments: Attachment[];
  uploads: UploadState[];
  onDelete: (id: string) => void;
  deletingId: string | undefined;
}

export function AttachmentList({
  attachments,
  uploads,
  onDelete,
  deletingId,
}: AttachmentListProps) {
  if (attachments.length === 0 && uploads.length === 0) return null;

  return (
    <ul className="space-y-1.5" aria-label="Attachments">
      {/* In-flight uploads at the top */}
      {uploads.map((u) => (
        <UploadProgressRow key={u.id} upload={u} />
      ))}

      {/* Saved attachments */}
      {attachments.map((a) => (
        <AttachmentRow
          key={a.id}
          attachment={a}
          onDelete={onDelete}
          isDeleting={deletingId === a.id}
        />
      ))}
    </ul>
  );
}
