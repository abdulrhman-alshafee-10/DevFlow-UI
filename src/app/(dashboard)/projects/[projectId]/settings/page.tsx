'use client';

import { use } from 'react';

import { useProject } from '@/hooks/use-projects';
import { ProjectForm } from '@/components/projects/project-form';
import { DeleteProjectSection } from '@/components/projects/delete-project-section';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import type { UpdateProjectFormValues } from '@/lib/schemas/project';

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default function ProjectSettingsPage({ params }: PageProps) {
  const { projectId } = use(params);
  const {
    project,
    isLoading,
    updateProject,
    isUpdating,
    updateError,
    deleteProject,
    isDeleting,
  } = useProject(projectId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner label="Loading project settings" />
      </div>
    );
  }

  function handleSave(values: UpdateProjectFormValues) {
    updateProject({
      name: values.name,
      description: values.description ?? null,
      dueDate: values.dueDate || null,
      status: values.status,
    });
  }

  return (
    <div className="max-w-xl animate-fade-in-up space-y-6">
      {/* General settings card */}
      <Card>
        <CardHeader>
          <CardTitle>Project details</CardTitle>
          <CardDescription>
            Update the name, description, and deadline for this project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm
            defaultValues={{
              name: project?.name ?? '',
              description: project?.description ?? '',
              dueDate: project?.dueDate ?? '',
              status: project?.status ?? 'active',
            }}
            onSave={handleSave}
            isSaving={isUpdating}
            saveError={updateError}
            showStatus
          />
        </CardContent>
      </Card>

      {/* Danger zone */}
      <DeleteProjectSection
        projectName={project?.name ?? ''}
        onDelete={deleteProject}
        isDeleting={isDeleting}
      />
    </div>
  );
}
