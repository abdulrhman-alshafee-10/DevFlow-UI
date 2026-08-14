'use client';

import { User, ShieldCheck } from 'lucide-react';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProfileUpdateForm } from '@/components/settings/profile-update-form';
import { ChangePasswordForm } from '@/components/settings/change-password-form';

export default function SettingsPage() {
  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account details and security preferences.
        </p>
      </div>

      {/* Tabbed layout */}
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="size-4" aria-hidden="true" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <ShieldCheck className="size-4" aria-hidden="true" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile tab */}
        <TabsContent value="profile">
          <div className="max-w-xl">
            <ProfileUpdateForm />
          </div>
        </TabsContent>

        {/* Security tab */}
        <TabsContent value="security">
          <div className="max-w-xl space-y-6">
            <ChangePasswordForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
