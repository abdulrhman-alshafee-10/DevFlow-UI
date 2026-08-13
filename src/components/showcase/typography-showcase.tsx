import { Card, CardContent } from '@/components/ui/card';

const typeScale = [
  { size: 'text-7xl', name: '7xl · 72px', sample: 'Display' },
  { size: 'text-6xl', name: '6xl · 60px', sample: 'Hero heading' },
  { size: 'text-5xl', name: '5xl · 48px', sample: 'Page title' },
  { size: 'text-4xl', name: '4xl · 36px', sample: 'Section title' },
  { size: 'text-3xl', name: '3xl · 30px', sample: 'Subsection' },
  { size: 'text-2xl', name: '2xl · 24px', sample: 'Card title' },
  { size: 'text-xl', name: 'xl · 20px', sample: 'Lead paragraph' },
  { size: 'text-lg', name: 'lg · 18px', sample: 'Large body' },
  { size: 'text-base', name: 'base · 16px', sample: 'Body copy' },
  { size: 'text-sm', name: 'sm · 14px', sample: 'Secondary text' },
  { size: 'text-xs', name: 'xs · 12px', sample: 'Meta / labels' },
];

export function TypographyShowcase() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Type scale</h3>
        <Card>
          <CardContent className="divide-y divide-border p-0">
            {typeScale.map((row) => (
              <div
                key={row.name}
                className="flex flex-col gap-2 p-4 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <span className="w-32 shrink-0 font-mono text-xs text-muted-foreground">
                  {row.name}
                </span>
                <span
                  className={`${row.size} font-display font-semibold tracking-tight`}
                >
                  {row.sample}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Font families</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="space-y-2 p-6">
              <p className="font-mono text-xs text-muted-foreground">
                font-sans
              </p>
              <p className="font-sans text-3xl font-semibold">Ag</p>
              <p className="text-sm text-muted-foreground">
                Inter — the workhorse UI face used everywhere by default.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2 p-6">
              <p className="font-mono text-xs text-muted-foreground">
                font-display
              </p>
              <p className="font-display text-3xl font-semibold">Ag</p>
              <p className="text-sm text-muted-foreground">
                Plus Jakarta Sans — warmer character, reserved for headings.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2 p-6">
              <p className="font-mono text-xs text-muted-foreground">
                font-mono
              </p>
              <p className="font-mono text-3xl font-semibold">Ag</p>
              <p className="text-sm text-muted-foreground">
                JetBrains Mono — for code, keyboard shortcuts, and tabular
                numerics.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
