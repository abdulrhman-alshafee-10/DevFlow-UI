'use client';

import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
} from '@/components/ui/modal';
import { PermissionGate } from '@/components/auth/permission-gate';

interface DeleteOrgSectionProps {
  orgName: string;
  onDelete: () => void;
  isDeleting?: boolean;
}

/**
 * Danger-zone card + confirmation modal for deleting an organization.
 * Only rendered when the current user passes the `org:delete` permission.
 */
export function DeleteOrgSection({
  orgName,
  onDelete,
  isDeleting,
}: DeleteOrgSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <PermissionGate permission="org:delete">
      <Card className="border-destructive/40">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle
              className="size-4 text-destructive"
              aria-hidden="true"
            />
            <CardTitle className="text-destructive">Danger zone</CardTitle>
          </div>
          <CardDescription>
            Deleting an organization permanently removes all its projects,
            tasks, and members. This cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => setOpen(true)}>
            <Trash2 className="size-4" aria-hidden="true" />
            Delete organization
          </Button>
        </CardContent>
      </Card>

      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Delete &ldquo;{orgName}&rdquo;?</ModalTitle>
            <ModalDescription>
              This will permanently delete the organization and all associated
              data. This action cannot be undone.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="outline" disabled={isDeleting}>
                Cancel
              </Button>
            </ModalClose>
            <Button
              variant="destructive"
              isLoading={isDeleting}
              loadingText="Deleting…"
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
            >
              Yes, delete organization
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </PermissionGate>
  );
}
