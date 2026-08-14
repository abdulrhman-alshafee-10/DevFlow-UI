import { FileText, FileImage, FileArchive, File } from 'lucide-react';

interface FileIconProps {
  mimeType: string;
  className?: string;
}

/**
 * Picks a Lucide icon appropriate for a given MIME type.
 */
export function FileIcon({ mimeType, className }: FileIconProps) {
  if (mimeType.startsWith('image/'))
    return <FileImage className={className} aria-hidden="true" />;
  if (mimeType === 'application/pdf')
    return <FileText className={className} aria-hidden="true" />;
  if (mimeType === 'application/zip')
    return <FileArchive className={className} aria-hidden="true" />;
  return <File className={className} aria-hidden="true" />;
}
