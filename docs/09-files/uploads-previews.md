# File Handling — Uploads & Previews

## What Is It?

Client-side file handling includes **drag-and-drop uploads**, **file previews**, **progress tracking**, and **client-side validation** before sending files to the backend.

## Why Does It Matter?

- **UX** — Drag-and-drop is intuitive; progress bars show upload status
- **Performance** — Validate file type and size before uploading
- **Preview** — Show image thumbnails before the upload completes
- **Security** — Client-side validation is a first line of defense (backend still validates)

## How Does It Fit into DevFlow?

### File Upload Component

```tsx
"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export function FileUpload({ taskId, onUploadComplete }: Props) {
  const [uploads, setUploads] = useState<UploadState[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const upload: UploadState = {
        id: crypto.randomUUID(),
        file,
        progress: 0,
        status: "uploading",
      };
      setUploads(prev => [...prev, upload]);

      try {
        await filesApi.upload(taskId, file, (progress) => {
          setUploads(prev =>
            prev.map(u => u.id === upload.id ? { ...u, progress } : u)
          );
        });
        setUploads(prev =>
          prev.map(u => u.id === upload.id ? { ...u, status: "done" } : u)
        );
        onUploadComplete?.();
      } catch {
        setUploads(prev =>
          prev.map(u => u.id === upload.id ? { ...u, status: "error" } : u)
        );
      }
    }
  }, [taskId, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer",
        isDragActive ? "border-primary bg-primary/5" : "border-muted"
      )}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop files here...</p>
      ) : (
        <p>Drag & drop files, or click to select</p>
      )}
      {uploads.map(u => (
        <UploadProgress key={u.id} upload={u} />
      ))}
    </div>
  );
}
```

## Common Mistakes

1. **No file size limits** — Always validate max file size on the client
2. **No progress feedback** — Users need to know the upload is working
3. **Blocking the UI** — Upload in background, don't freeze the page
4. **Not handling errors** — Show retry options for failed uploads

## What I Should Be Able to Do Afterward

- [ ] Implement drag-and-drop file uploads with react-dropzone
- [ ] Show upload progress bars
- [ ] Preview images before uploading
- [ ] Validate file type and size on the client
- [ ] Handle upload errors with retry options
