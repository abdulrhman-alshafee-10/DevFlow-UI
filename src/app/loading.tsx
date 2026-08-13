import { Spinner } from '@/components/ui/spinner';

export default function GlobalLoading() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background text-muted-foreground">
      <Spinner className="size-8 text-primary" />
      <p className="text-sm">Loading DevFlow...</p>
    </div>
  );
}
