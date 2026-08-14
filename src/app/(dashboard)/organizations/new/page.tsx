'use client';

import { useRouter } from 'next/navigation';

import { useOrganizations } from '@/hooks/use-organizations';
import { CreateOrgForm } from '@/components/organizations/create-org-form';

export default function NewOrganizationPage() {
  const router = useRouter();
  const { createOrgAsync, isCreating, createError } = useOrganizations();

  async function handleSubmit(name: string) {
    try {
      const org = await createOrgAsync({ name });
      router.push(`/organizations/${org.id}/members`);
    } catch {
      // Error toast already handled in the hook
    }
  }

  return (
    <div className="mx-auto max-w-lg animate-fade-in-up space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Create an organization
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Organizations group your projects and team members in one workspace.
        </p>
      </div>

      <CreateOrgForm
        onSubmit={handleSubmit}
        isSubmitting={isCreating}
        submitError={createError}
        onCancel={() => router.back()}
      />
    </div>
  );
}
