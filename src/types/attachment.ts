import type { Timestamps } from './index';

/** A file attachment linked to a task. */
export interface Attachment extends Timestamps {
  id: string;
  taskId: string;
  uploadedById: string;
  /** Original file name provided by the user. */
  filename: string;
  /** MIME type, e.g. `"image/png"` or `"application/pdf"`. */
  mimeType: string;
  /** File size in bytes. */
  size: number;
  /** Presigned / public download URL. */
  url: string;
}

/** Progress state for an in-flight upload slot. */
export type UploadStatus = 'uploading' | 'done' | 'error';

export interface UploadState {
  /** Client-side id for React key + update targeting. */
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
}
