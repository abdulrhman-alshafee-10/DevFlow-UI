'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/modal';

export function ModalShowcase() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Uncontrolled
          </h3>
          <p className="mb-3 text-sm text-muted-foreground">
            The trigger opens and closes the modal without any local state.
          </p>
          <Modal>
            <ModalTrigger asChild>
              <Button>Open modal</Button>
            </ModalTrigger>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Delete workspace?</ModalTitle>
                <ModalDescription>
                  This action cannot be undone. All projects and tasks in this
                  workspace will be permanently removed.
                </ModalDescription>
              </ModalHeader>
              <ModalFooter>
                <ModalClose asChild>
                  <Button variant="outline">Cancel</Button>
                </ModalClose>
                <Button variant="destructive">Confirm</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Controlled
          </h3>
          <p className="mb-3 text-sm text-muted-foreground">
            An external state drives <code>open</code> so the caller can react
            to the dialog lifecycle.
          </p>
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open controlled modal
          </Button>
          <Modal open={open} onOpenChange={setOpen}>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Controlled dialog</ModalTitle>
                <ModalDescription>
                  Open state lives in a <code>useState</code> hook on the
                  parent. The modal calls <code>onOpenChange</code> whenever the
                  user dismisses it.
                </ModalDescription>
              </ModalHeader>
              <ModalFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </section>
      </CardContent>
    </Card>
  );
}
