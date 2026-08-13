# DevFlow — Frontend

The web client for the DevFlow project management platform. Built with
Next.js 14 (App Router), TypeScript, and Tailwind CSS.

> Currently on **Phase 1 — Foundation & Architecture**. The application
> renders a Design System showcase demonstrating every color token,
> font, and UI primitive established in this phase.

---

## Requirements

- **Node.js** 20 LTS or newer
- **npm** 10+ (bundled with Node 20+)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Copy env template
cp .env.example .env.local

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command                | Purpose                               |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Start the Next.js dev server with HMR |
| `npm run build`        | Production build                      |
| `npm run start`        | Serve the production build            |
| `npm run lint`         | Run ESLint on the whole project       |
| `npm run lint:fix`     | ESLint with auto-fix                  |
| `npm run format`       | Format everything with Prettier       |
| `npm run format:check` | Verify formatting without writing     |
| `npm run type-check`   | Run TypeScript without emitting       |

## Project structure

```
DevFlow-front-end/
├── docs/                # Learning + roadmap documentation
├── public/              # Static assets served as-is
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── layout.tsx   # Root layout + fonts + providers
│   │   ├── page.tsx     # Design system showcase (Phase 1 landing)
│   │   ├── providers.tsx
│   │   ├── loading.tsx  # Global loading state
│   │   ├── error.tsx    # Global error boundary
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── ui/          # Design system primitives (Button, Input, ...)
│   │   ├── layout/      # SiteHeader, ThemeToggle
│   │   └── showcase/    # Sections used on the landing page
│   │
│   ├── config/          # Fonts, site metadata, env access
│   ├── hooks/           # Reusable React hooks
│   ├── lib/
│   │   └── utils/       # cn() and misc helpers
│   ├── styles/
│   │   └── globals.css  # Tailwind base + CSS variable tokens
│   └── types/           # Shared TypeScript types
│
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs
└── package.json
```

## Design system quick reference

Semantic color tokens (light + dark, HSL-based):

- **Surfaces** — `background`, `foreground`, `card`, `popover`
- **Brand** — `primary` / `primary-foreground`
- **Neutrals** — `secondary`, `muted`, `accent`, `border`, `input`, `ring`
- **Feedback** — `destructive`, `success`, `warning`, `info`

Raw scale: `brand-{50…950}` (theme-independent indigo).

Typography variables (assigned via `next/font`):

- `--font-sans` — Inter
- `--font-display` — Plus Jakarta Sans
- `--font-mono` — JetBrains Mono

All primitives live in `src/components/ui` and re-export from
`@/components/ui`.

## Contributing (during learning)

- Formatting and linting run automatically on commit via Husky +
  lint-staged.
- Prefer absolute imports from `@/…`.
- Keep client-side interactivity behind `'use client'` — leave everything
  else on the server by default.

## License

Educational project. See the DevFlow learning documentation for context.
