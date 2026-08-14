'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Paperclip, Upload } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { Spinner } from '@/components/ui/spinner';
import { AttachmentList } from './attachment-list';
import { useAttachments, ACCEPTED_MIME } from '@/hooks/use-attachments';

interface FileUploadZoneProps {
  taskId: string;
}

/**
 * Drag-and-drop file upload zone + attached file list.
 *
 * - Accepts images, PDFs, plain text, and ZIP files up to 10 MB each.
 * - Shows per-file progress bars while uploading.
 * - Renders saved attachments with download + delete controls.
 */
export function FileUploadZone({ taskId }: FileUploadZoneProps) {
  const {
    attachments,
    isLoading,
    uploads,
    upload,
    deleteAttachment,
    isDeleting,
    deletingId,
  } = useAttachments(taskId);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      void upload(acceptedFiles);
    },
    [upload],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPTED_MIME,
    maxSize: 10 * 1024 * 1024,
    noClick: false,
    noKeyboard: false,
  });

  return (
    <div className="space-y-3">
      {/* Section heading */}
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Paperclip className="size-3.5" aria-hidden="true" />
        Attachments
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors',
          isDragActive
            ? 'border-primary bg-primary/5 text-primary'
            : 'border-muted-foreground/25 text-muted-foreground hover:border-muted-foreground/50 hover:bg-muted/40',
        )}
        aria-label={
          isDragActive
            ? 'Drop files to upload'
            : 'Click or drag files to upload'
        }
      >
        <input {...getInputProps()} aria-label="File input" />
        <Upload className="size-5" aria-hidden="true" />
        {isDragActive ? (
          <p className="text-sm font-medium">Drop files here…</p>
        ) : (
          <div>
            <p className="text-sm font-medium">
              Drag & drop or{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  open();
                }}
                className="text-primary underline-offset-2 hover:underline focus-visible:underline focus-visible:outline-none"
              >
                browse
              </button>
            </p>
            <p className="mt-0.5 text-xs">
              PNG, JPG, GIF, PDF, TXT, ZIP — max 10 MB
            </p>
          </div>
        )}
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Spinner className="size-3.5" label="Loading attachments" />
          Loading attachments…
        </div>
      )}

      {/* Attachment list */}
      {!isLoading && (
        <AttachmentList
          attachments={attachments}
          uploads={uploads}
          onDelete={deleteAttachment}
          deletingId={deletingId}
        />
      )}
    </div>
  );
}
