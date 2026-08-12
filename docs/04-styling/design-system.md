# Styling — Design System & Component Library

## What Is It?

A **design system** is a collection of reusable components, design tokens, and guidelines that ensure visual consistency across an application. For DevFlow, we build our own design system on top of **Radix UI primitives** + **Tailwind CSS**.

## Why Does It Matter?

- **Consistency** — Every button, input, and modal looks and behaves the same
- **Accessibility** — Radix UI handles keyboard navigation, focus management, and ARIA
- **Speed** — Developers grab pre-built components instead of building from scratch
- **Maintainability** — Change a design token, update everywhere

## Design Tokens

```typescript
// Defined in tailwind.config.ts
colors: {
  // Semantic colors
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  primary:    "hsl(var(--primary))",
  secondary:  "hsl(var(--secondary))",
  muted:      "hsl(var(--muted))",
  accent:     "hsl(var(--accent))",
  destructive:"hsl(var(--destructive))",
  border:     "hsl(var(--border))",
  ring:       "hsl(var(--ring))",
}
```

```css
/* globals.css — Light theme */
:root {
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  --primary: 239 84% 67%;
  --secondary: 240 5% 96%;
  --muted: 240 5% 96%;
  --accent: 240 5% 96%;
  --destructive: 0 84% 60%;
  --border: 240 6% 90%;
  --ring: 239 84% 67%;
}

/* Dark theme */
.dark {
  --background: 222 47% 11%;
  --foreground: 210 40% 98%;
  --primary: 239 84% 67%;
  --secondary: 217 33% 17%;
  --muted: 217 33% 17%;
  --accent: 217 33% 17%;
  --destructive: 0 63% 31%;
  --border: 217 33% 17%;
  --ring: 224 76% 48%;
}
```

## Core UI Components

| Component | Built With | Purpose |
|---|---|---|
| Button | Tailwind + variants | Actions, form submissions |
| Input | Tailwind + Radix Label | Text input, search fields |
| Modal/Dialog | Radix Dialog | Confirmations, forms |
| Dropdown Menu | Radix DropdownMenu | Context menus, actions |
| Select | Radix Select | Dropdowns with options |
| Tooltip | Radix Tooltip | Hover information |
| Toast | Radix Toast | Notifications, feedback |
| Avatar | Tailwind | User profile images |
| Badge | Tailwind | Status indicators, tags |
| Tabs | Radix Tabs | Content switching |
| DataTable | Tailwind + TanStack Table | Sortable, filterable tables |

## Class Name Utility

```typescript
// lib/utils/cn.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage
<button className={cn(
  "px-4 py-2 rounded-lg font-medium",
  variant === "primary" && "bg-primary text-white",
  variant === "ghost" && "bg-transparent hover:bg-muted",
  disabled && "opacity-50 cursor-not-allowed"
)} />
```

## What I Should Be Able to Do Afterward

- [ ] Set up design tokens with CSS custom properties
- [ ] Build accessible UI components with Radix UI primitives
- [ ] Create component variants using `cn()` and conditional classes
- [ ] Implement a theme switching system (light/dark mode)
- [ ] Build a consistent, reusable component library
