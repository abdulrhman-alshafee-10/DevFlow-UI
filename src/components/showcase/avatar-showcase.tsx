'use client';

import { Avatar, type AvatarSize } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

const SIZES: readonly AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

export function AvatarShowcase() {
  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Image, initials, and empty fallback
          </h3>
          <div className="flex flex-wrap items-center gap-4">
            <Avatar src="https://i.pravatar.cc/150?img=13" name="Alan Turing" />
            <Avatar name="Grace Hopper" />
            <Avatar name="" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Left: remote image. Middle: initials fallback derived from the name.
            Right: empty name renders the sentinel <code>?</code>.
          </p>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Size scale
          </h3>
          <div className="flex flex-wrap items-end gap-4">
            {SIZES.map((size) => (
              <div key={size} className="flex flex-col items-center gap-1">
                <Avatar name="Ada Lovelace" size={size} />
                <span className="font-mono text-2xs text-muted-foreground">
                  {size}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="md:col-span-2">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Deterministic hue
          </h3>
          <div className="flex flex-wrap items-center gap-4">
            <Avatar name="Ada Lovelace" />
            <Avatar name="Ada Lovelace" />
            <Avatar name="Ada Lovelace" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            The same name always hashes to the same palette entry, so these
            three avatars share the exact same background color.
          </p>
        </section>
      </CardContent>
    </Card>
  );
}
