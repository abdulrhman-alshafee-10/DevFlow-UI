'use client';

import { FolderKanban } from 'lucide-react';

import { useProjects } from '@/hooks/use-projects';
import { ProjectForm } from './project-form';
import type { UpdateProjectFormValues } from '@/lib/schemas/project';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from '@/components/ui/modal';

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Modal that wraps `ProjectForm` for the create-project flow.
 * Closes automatically on success.
 */
export function CreateProjectModal({ open, onClose }: CreateProjectModalProps) {
  const { createProjectAsync, isCreating, createError } = useProjects();

  async function handleSave(values: UpdateProjectFormValues) {
    try {
      await createProjectAsync({
        name: values.name,
        description: values.description || undefined,
        dueDate: values.dueDate || undefined,
      });
      onClose();
    } catch {
      // Error toast fired in the hook
    }
  }

  return (
    <Modal open={open} onOpenChange={(o) => !o && onClose()}>
      <ModalContent className="max-w-md">
        <ModalHeader>
          <div className="flex items-center gap-2">
            <FolderKanban
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <ModalTitle>New project</ModalTitle>
          </div>
          <ModalDescription>
            Create a new project in the current organization.
          </ModalDescription>
        </ModalHeader>

        <div className="px-0 pb-2">
          <ProjectForm
            onSave={handleSave}
            isSaving={isCreating}
            saveError={createError}
            submitLabel="Create project"
            onCancel={onClose}
          />
        </div>
      </ModalContent>
    </Modal>
  );
}
