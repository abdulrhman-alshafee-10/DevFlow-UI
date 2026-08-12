# Styling — Tailwind CSS

## What Is It?

Tailwind CSS is a **utility-first CSS framework** that provides low-level utility classes to build designs directly in your markup. Instead of writing custom CSS, you compose utility classes like `flex`, `pt-4`, `text-center`, and `rounded-lg`.

## Why Does It Matter?

- **Rapid development** — Build UI faster without switching between files
- **Consistent design** — Built-in design system with spacing, colors, typography scales
- **Small production CSS** — Purges unused classes for tiny bundle sizes
- **Dark mode** — First-class dark mode support with the `dark:` variant
- **Responsive** — Mobile-first breakpoints with `sm:`, `md:`, `lg:`, `xl:` prefixes

## How Does It Fit into DevFlow?

```tsx
// Button component with Tailwind
<button className="
  inline-flex items-center justify-center
  rounded-lg px-4 py-2
  bg-indigo-600 text-white font-medium
  hover:bg-indigo-700
  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors duration-200
  dark:bg-indigo-500 dark:hover:bg-indigo-600
">
  Create Task
</button>
```

## Design System Setup

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eef2ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          900: "#312e81",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
```

## Common Mistakes

1. **Not using a design system** — Random spacing and colors
2. **Class name soup** — Extract components instead of repeating long class strings
3. **Fighting Tailwind** — If you need custom CSS, use CSS modules alongside Tailwind
4. **Not purging unused styles** — Ensure `content` paths are correctly configured

## What I Should Be Able to Do Afterward

- [ ] Configure Tailwind CSS in a Next.js project
- [ ] Build responsive layouts with Tailwind breakpoints
- [ ] Implement dark mode with the `dark:` variant
- [ ] Create a custom design token system (colors, fonts, spacing)
- [ ] Use `cn()` utility to merge conditional class names
- [ ] Extract repeated class patterns into reusable components
