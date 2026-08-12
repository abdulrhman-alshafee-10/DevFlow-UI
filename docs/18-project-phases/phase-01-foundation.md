# Phase 1 — Foundation & Architecture

## Objective

Set up the Next.js project from scratch, configure the development environment, and establish the project structure. A major focus of this phase is **establishing the complete Design System**: configuring fonts, global colors, dark/light themes, and implementing the core UI components using Tailwind CSS and Radix UI. This is the visual and structural foundation upon which the entire DevFlow frontend is built.

---

## Concepts Learned

- Next.js App Router initialization
- TypeScript configuration for React
- Directory structure and module organization
- Tailwind CSS configuration and design tokens
- Absolute imports (`@/components/...`)
- Environment variable management
- Code quality tools (ESLint, Prettier, Husky)
- Building the first accessible UI components

**Relevant docs**:
- `01-typescript/fundamentals.md`
- `03-nextjs/app-router.md`
- `04-styling/tailwind-css.md`
- `04-styling/design-system.md`

---

## Features After This Phase

- [ ] Next.js application runs locally
- [ ] Project structure follows the layered architecture
- [ ] Tailwind CSS is configured with DevFlow brand colors
- [ ] Dark mode toggle works
- [ ] Core UI components are built (Button, Input)
- [ ] Absolute imports are working
- [ ] Linting and formatting run automatically on commit

---

## API Integration

**None** — We are just building the UI foundation.

---

## Component Requirements

### 1. `Button` Component
- Variants: `primary`, `secondary`, `destructive`, `ghost`, `outline`
- Sizes: `sm`, `md`, `lg`, `icon`
- States: `disabled`, `loading` (shows spinner)
- Built with `cn()` for class merging

### 2. `Input` Component
- Label support
- Error state with error message display
- Helper text support
- Proper ARIA attributes for accessibility

---

## Testing Requirements

- Components render without crashing
- Button triggers `onClick` event
- Input correctly handles `onChange` event

---

## Completion Checklist

- [ ] Run `npx create-next-app@latest devflow-frontend` (TypeScript, Tailwind, App Router, src dir)
- [ ] Configure `tsconfig.json` paths for `@/*`
- [ ] Set up ESLint and Prettier with `eslint-config-prettier`
- [ ] Initialize Git repository
- [ ] Create `.env.example` and `.env.local` files
- [ ] Import and configure custom fonts (e.g., via `next/font/google`)
- [ ] Define the complete Design System tokens in `tailwind.config.ts` (brand colors, typography, spacing)
- [ ] Set up light and dark mode CSS variables in `src/styles/globals.css`
- [ ] Implement `cn()` utility in `src/lib/utils/cn.ts`
- [ ] Create `src/components/ui/button.tsx`
- [ ] Create `src/components/ui/input.tsx`
- [ ] Implement a basic landing page at `src/app/page.tsx` displaying the design system (fonts, colors, components)
- [ ] Test the components in light and dark modes
