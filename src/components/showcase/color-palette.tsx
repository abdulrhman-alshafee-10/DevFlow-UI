import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

const semanticTokens = [
  {
    name: 'background',
    className: 'bg-background',
    textClass: 'text-foreground',
    border: true,
  },
  {
    name: 'foreground',
    className: 'bg-foreground',
    textClass: 'text-background',
  },
  {
    name: 'primary',
    className: 'bg-primary',
    textClass: 'text-primary-foreground',
  },
  {
    name: 'secondary',
    className: 'bg-secondary',
    textClass: 'text-secondary-foreground',
  },
  { name: 'muted', className: 'bg-muted', textClass: 'text-muted-foreground' },
  {
    name: 'accent',
    className: 'bg-accent',
    textClass: 'text-accent-foreground',
  },
  {
    name: 'card',
    className: 'bg-card',
    textClass: 'text-card-foreground',
    border: true,
  },
  {
    name: 'destructive',
    className: 'bg-destructive',
    textClass: 'text-destructive-foreground',
  },
  {
    name: 'success',
    className: 'bg-success',
    textClass: 'text-success-foreground',
  },
  {
    name: 'warning',
    className: 'bg-warning',
    textClass: 'text-warning-foreground',
  },
  { name: 'info', className: 'bg-info', textClass: 'text-info-foreground' },
  { name: 'border', className: 'bg-border', textClass: 'text-foreground' },
];

const brandScale = [
  { shade: '50', className: 'bg-brand-50', dark: false },
  { shade: '100', className: 'bg-brand-100', dark: false },
  { shade: '200', className: 'bg-brand-200', dark: false },
  { shade: '300', className: 'bg-brand-300', dark: false },
  { shade: '400', className: 'bg-brand-400', dark: false },
  { shade: '500', className: 'bg-brand-500', dark: true },
  { shade: '600', className: 'bg-brand-600', dark: true },
  { shade: '700', className: 'bg-brand-700', dark: true },
  { shade: '800', className: 'bg-brand-800', dark: true },
  { shade: '900', className: 'bg-brand-900', dark: true },
  { shade: '950', className: 'bg-brand-950', dark: true },
];

export function ColorPalette() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Semantic tokens</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Every color below is theme-aware — it swaps automatically when you
          toggle light and dark modes.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {semanticTokens.map((token) => (
            <Card key={token.name} className="overflow-hidden">
              <div
                className={cn(
                  'flex h-20 items-center justify-center',
                  token.className,
                  token.border && 'border-b border-border',
                )}
              >
                <span
                  className={cn(
                    'font-mono text-xs font-medium',
                    token.textClass,
                  )}
                >
                  {token.name}
                </span>
              </div>
              <CardContent className="p-3 pt-3">
                <p className="font-mono text-xs text-muted-foreground">
                  --{token.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Brand scale</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Raw indigo palette — theme-independent. Use for gradients, badges, or
          one-off accents.
        </p>
        <div className="grid grid-cols-4 gap-2 md:grid-cols-11">
          {brandScale.map((step) => (
            <div key={step.shade} className="text-center">
              <div
                className={cn(
                  'h-16 rounded-md ring-1 ring-inset ring-border',
                  step.className,
                )}
              />
              <p className="mt-1.5 font-mono text-2xs text-muted-foreground">
                brand-{step.shade}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
