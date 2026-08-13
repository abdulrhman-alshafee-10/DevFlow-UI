'use client';

import { useState } from 'react';
import { Mail, Search, User } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export function InputShowcase() {
  const [email, setEmail] = useState('not-an-email');

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <Input
          label="Full name"
          placeholder="Ada Lovelace"
          helperText="Displayed on your profile and comments."
        />

        <Input
          label="Username"
          placeholder="ada"
          required
          leftIcon={<User aria-hidden="true" />}
        />

        <Input
          label="Search"
          placeholder="Search tasks, projects, people..."
          leftIcon={<Search aria-hidden="true" />}
          type="search"
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@company.com"
          leftIcon={<Mail aria-hidden="true" />}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={
            !email.includes('@') && email.length > 0
              ? 'Please enter a valid email address.'
              : undefined
          }
        />

        <Input label="Disabled" placeholder="Cannot edit this" disabled />

        <Input
          label="Read-only"
          value="ada@devflow.io"
          readOnly
          helperText="Contact support to change your email."
        />
      </CardContent>
    </Card>
  );
}
