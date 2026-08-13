'use client';

import { useState } from 'react';
import { ArrowRight, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const variants = [
  'primary',
  'secondary',
  'outline',
  'ghost',
  'destructive',
  'link',
] as const;
const sizes = ['sm', 'md', 'lg', 'icon'] as const;

export function ButtonShowcase() {
  const [loading, setLoading] = useState(false);

  const simulateAsync = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="space-y-6 p-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Variants
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              {variants.map((variant) => (
                <Button key={variant} variant={variant}>
                  {variant}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Sizes
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              {sizes.map((size) =>
                size === 'icon' ? (
                  <Button key={size} size={size} aria-label="Add item">
                    <Plus aria-hidden="true" />
                  </Button>
                ) : (
                  <Button key={size} size={size}>
                    Size: {size}
                  </Button>
                ),
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              With icons
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button leftIcon={<Plus aria-hidden="true" />}>
                Create task
              </Button>
              <Button
                variant="outline"
                rightIcon={<ArrowRight aria-hidden="true" />}
              >
                Continue
              </Button>
              <Button
                variant="destructive"
                leftIcon={<Trash2 aria-hidden="true" />}
              >
                Delete project
              </Button>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              States
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button disabled>Disabled</Button>
              <Button
                isLoading={loading}
                loadingText="Saving..."
                onClick={simulateAsync}
              >
                Click to load
              </Button>
              <Button variant="outline" isLoading loadingText="Fetching">
                Loading outline
              </Button>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Full width
            </h3>
            <Button fullWidth>Full-width call to action</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
