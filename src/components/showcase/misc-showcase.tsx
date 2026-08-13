import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils/cn';

const radii = [
  { name: 'rounded-sm', className: 'rounded-sm' },
  { name: 'rounded-md', className: 'rounded-md' },
  { name: 'rounded-lg', className: 'rounded-lg' },
  { name: 'rounded-xl', className: 'rounded-xl' },
  { name: 'rounded-2xl', className: 'rounded-2xl' },
  { name: 'rounded-full', className: 'rounded-full' },
];

const shadows = [
  { name: 'shadow-xs', className: 'shadow-xs' },
  { name: 'shadow-soft', className: 'shadow-soft' },
  { name: 'shadow-elevated', className: 'shadow-elevated' },
  { name: 'shadow-glow', className: 'shadow-glow' },
];

export function MiscShowcase() {
  return (
    <div className="space-y-10">
      <section>
        <h3 className="mb-4 text-lg font-semibold">Radius scale</h3>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
          {radii.map((r) => (
            <div key={r.name} className="text-center">
              <div
                className={cn(
                  'h-20 border border-border bg-secondary',
                  r.className,
                )}
              />
              <p className="mt-1.5 font-mono text-2xs text-muted-foreground">
                {r.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold">Elevation</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {shadows.map((s) => (
            <div
              key={s.name}
              className={cn(
                'flex h-24 items-center justify-center rounded-lg border border-border bg-card',
                s.className,
              )}
            >
              <span className="font-mono text-xs text-muted-foreground">
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold">Cards & Spinner</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Total tasks</CardTitle>
              <CardDescription>
                Across all projects in the current organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-display text-4xl font-bold">1,284</p>
              <p className="mt-1 text-sm text-success">+12.5% vs last month</p>
            </CardContent>
          </Card>

          <Card className="flex items-center justify-center">
            <CardContent className="flex flex-col items-center gap-3 p-8 text-muted-foreground">
              <Spinner className="size-8 text-primary" />
              <p className="text-sm">Loading dashboard...</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
