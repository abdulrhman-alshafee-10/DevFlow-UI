'use client';

import { use } from 'react';

import { useOrganization } from '@/hooks/use-organizations';
import { OrgNameForm } from '@/components/organizations/org-name-form';
import { DeleteOrgSection } from '@/components/organizations/delete-org-section';
import { Spinner } from '@/components/ui/spinner';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrgSettingsPage({ params }: PageProps) {
  const { id: orgId } = use(params);
  const {
    org,
    isLoading,
    updateOrg,
    isUpdating,
    updateError,
    deleteOrg,
    isDeleting,
  } = useOrganization(orgId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner label="Loading organization" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Organization Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage details and settings for{' '}
          <span className="font-medium text-foreground">{org?.name}</span>.
        </p>
      </div>

      <div className="max-w-xl space-y-6">
        <OrgNameForm
          defaultName={org?.name ?? ''}
          onSave={(name) => updateOrg({ name })}
          isSaving={isUpdating}
          saveError={updateError}
        />

        <DeleteOrgSection
          orgName={org?.name ?? ''}
          onDelete={deleteOrg}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
}
