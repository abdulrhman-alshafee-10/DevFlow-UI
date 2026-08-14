# DevFlow — Frontend

The web client for the DevFlow project management platform. Built with Next.js 14 (App Router), TypeScript, and Tailwind CSS.

---

## Tech stack

| Layer            | Technology                                        |
| ---------------- | ------------------------------------------------- |
| Framework        | Next.js 14 (App Router)                           |
| Language         | TypeScript 5                                      |
| Styling          | Tailwind CSS + CSS variables                      |
| Components       | Radix UI primitives + custom design system        |
| State            | Zustand (global) + TanStack Query (server state)  |
| Forms            | React Hook Form + Zod                             |
| Real-time        | WebSockets + SSE                                  |
| Testing          | Vitest + React Testing Library + MSW + Playwright |
| Containerization | Docker (multi-stage)                              |

---

## Requirements

- **Node.js** 20 LTS or newer
- **npm** 10+ (bundled with Node 20+)

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in values
cp .env.example .env.local

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

| Variable                   | Description                                                |
| -------------------------- | ---------------------------------------------------------- |
| `NEXT_PUBLIC_APP_URL`      | Public URL of this frontend (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_API_URL`      | FastAPI backend base URL (e.g. `http://localhost:8000`)    |
| `NEXT_PUBLIC_WS_URL`       | WebSocket base URL (e.g. `ws://localhost:8000`)            |
| `NEXT_PUBLIC_ENABLE_DEBUG` | Enable verbose client-side logging (`true` / `false`)      |

`NEXT_PUBLIC_*` variables are baked into the client bundle at **build time**. Never put secrets behind this prefix.

---

## Available scripts

| Command                | Purpose                               |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Start the Next.js dev server with HMR |
| `npm run build`        | Production build                      |
| `npm run start`        | Serve the production build            |
| `npm run lint`         | Run ESLint                            |
| `npm run lint:fix`     | ESLint with auto-fix                  |
| `npm run format`       | Format everything with Prettier       |
| `npm run format:check` | Verify formatting without writing     |
| `npm run type-check`   | TypeScript check without emitting     |
| `npm test`             | Run unit + component tests (Vitest)   |
| `npm run test:watch`   | Vitest in watch mode                  |
| `npm run test:e2e`     | Run Playwright E2E tests              |
| `npm run test:e2e:ui`  | Playwright interactive UI mode        |

---

## Project structure

```
DevFlow-front-end/
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/          # Login, register, forgot password
│   │   ├── (dashboard)/     # Protected app routes
│   │   │   ├── dashboard/
│   │   │   ├── projects/
│   │   │   ├── organizations/
│   │   │   └── settings/
│   │   ├── layout.tsx       # Root layout + providers
│   │   ├── providers.tsx    # QueryClient, theme, auth
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── ui/              # Design system primitives
│   │   ├── layout/          # Shell, topbar, sidebar, nav
│   │   ├── auth/            # Login/register forms, guards
│   │   ├── tasks/           # Board, cards, filters, modals
│   │   ├── comments/        # Comment input + list
│   │   ├── notifications/   # Notification panel
│   │   ├── search/          # Command palette + results
│   │   ├── files/           # Attachment upload + list
│   │   ├── ai/              # AI chat, streaming, markdown
│   │   └── settings/        # Profile + org settings forms
│   │
│   ├── hooks/               # Custom React hooks
│   ├── lib/
│   │   ├── api/             # Axios API modules (auth, tasks, …)
│   │   ├── schemas/         # Zod validation schemas
│   │   ├── utils/           # cn() and misc helpers
│   │   └── ws/              # WebSocket client
│   ├── stores/              # Zustand stores
│   ├── styles/
│   │   └── globals.css      # Tailwind base + CSS variable tokens
│   ├── test/                # Test setup + MSW mocks
│   └── types/               # Shared TypeScript types
│
├── tests/
│   └── e2e/                 # Playwright E2E tests
│
├── Dockerfile               # Multi-stage production image
├── docker-compose.yml       # Frontend + backend services
├── playwright.config.ts
├── vitest.config.ts
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## Design system

Semantic color tokens (light + dark, HSL-based):

- **Surfaces** — `background`, `foreground`, `card`, `popover`
- **Brand** — `primary` / `primary-foreground`
- **Neutrals** — `secondary`, `muted`, `accent`, `border`, `input`, `ring`
- **Feedback** — `destructive`, `success`, `warning`, `info`

All primitives live in `src/components/ui` and re-export from `@/components/ui`.

---

## Docker

```bash
# Build and start all services
docker-compose up --build

# Build the image directly
docker build -t devflow-frontend .

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8000 \
  devflow-frontend
```

The image uses `output: "standalone"` mode — only the files required to run the app are included, keeping the final image small.

---

## Testing

```bash
# Unit + component tests
npm test

# E2E (requires the app running on :3000)
npx playwright install   # first time only
npm run test:e2e
```

MSW intercepts all API calls in unit tests — no real backend needed.

---

## Code conventions

- Absolute imports via `@/…`
- Server components by default; `'use client'` only where interactivity is needed
- Formatting and linting run automatically on commit via Husky + lint-staged

---

## License

MIT
