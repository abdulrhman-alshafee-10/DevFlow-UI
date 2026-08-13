import { Hero } from '@/components/showcase/hero';
import { SiteHeader } from '@/components/layout/site-header';
import { ShowcaseSection } from '@/components/showcase/section';
import { ColorPalette } from '@/components/showcase/color-palette';
import { TypographyShowcase } from '@/components/showcase/typography-showcase';
import { ButtonShowcase } from '@/components/showcase/button-showcase';
import { InputShowcase } from '@/components/showcase/input-showcase';
import { MiscShowcase } from '@/components/showcase/misc-showcase';
import { siteConfig } from '@/config/site';

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="flex-1">
        <Hero />

        <ShowcaseSection
          id="tokens"
          eyebrow="Design tokens"
          title="A single source of truth for color"
          description="Every semantic token below is defined once as an HSL variable and consumed by Tailwind. Toggle the theme in the header to watch them adapt."
        >
          <ColorPalette />
        </ShowcaseSection>

        <ShowcaseSection
          eyebrow="Typography"
          title="Purposeful, legible, and hierarchical"
          description="Three optimized web fonts — display, sans, and mono — loaded through next/font with zero layout shift."
        >
          <TypographyShowcase />
        </ShowcaseSection>

        <ShowcaseSection
          id="components"
          eyebrow="Components"
          title="Buttons for every intent"
          description="All variants are backed by class-variance-authority so consumers get autocompletion for `variant`, `size`, and states."
        >
          <ButtonShowcase />
        </ShowcaseSection>

        <ShowcaseSection
          eyebrow="Components"
          title="Inputs with proper accessibility"
          description="Labels, helper text, error announcements, and required-field semantics are wired up automatically."
        >
          <InputShowcase />
        </ShowcaseSection>

        <ShowcaseSection
          eyebrow="Foundations"
          title="Radius, elevation, and supporting bits"
          description="The remaining primitives that give DevFlow its personality."
        >
          <MiscShowcase />
        </ShowcaseSection>
      </main>

      <footer className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 text-sm text-muted-foreground md:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Foundation phase
            complete.
          </p>
          <p className="font-mono text-xs">
            Built with Next.js · Tailwind CSS · TypeScript
          </p>
        </div>
      </footer>
    </div>
  );
}
