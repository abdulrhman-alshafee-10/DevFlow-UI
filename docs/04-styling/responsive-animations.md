# Styling — Responsive Design & Animations

## What Is It?

**Responsive design** ensures your application looks and works well on all screen sizes. **Animations** enhance the user experience with smooth transitions, micro-interactions, and visual feedback.

## Responsive Design with Tailwind

Tailwind uses a **mobile-first** approach. Base classes apply to all screens; breakpoint prefixes apply to larger screens.

```
sm:  → 640px+   (small tablets)
md:  → 768px+   (tablets)
lg:  → 1024px+  (laptops)
xl:  → 1280px+  (desktops)
2xl: → 1536px+  (large screens)
```

### DevFlow Dashboard Layout

```tsx
<div className="flex flex-col lg:flex-row min-h-screen">
  {/* Sidebar: hidden on mobile, visible on desktop */}
  <aside className="hidden lg:block lg:w-64 border-r">
    <Sidebar />
  </aside>

  {/* Mobile nav: visible on mobile, hidden on desktop */}
  <nav className="lg:hidden border-b p-4">
    <MobileNav />
  </nav>

  {/* Main content: full width on mobile, adjusted on desktop */}
  <main className="flex-1 p-4 md:p-6 lg:p-8">
    {children}
  </main>
</div>
```

## Animations with Framer Motion

```tsx
import { motion, AnimatePresence } from "framer-motion";

// Page transition
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  <PageContent />
</motion.div>

// Task card with hover and layout animation
<motion.div
  layout                        // Animate position changes
  whileHover={{ scale: 1.02 }}  // Scale on hover
  whileTap={{ scale: 0.98 }}    // Shrink on click
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  <TaskCard task={task} />
</motion.div>

// Notification slide-in
<AnimatePresence>
  {notifications.map(n => (
    <motion.div
      key={n.id}
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
    >
      <Toast notification={n} />
    </motion.div>
  ))}
</AnimatePresence>
```

## Common Mistakes

1. **Desktop-first design** — Always start with mobile, add breakpoints for larger screens
2. **Fixed widths** — Use `max-w-`, `w-full`, percentages instead of pixel widths
3. **Too many animations** — Subtle is better; respect `prefers-reduced-motion`
4. **Heavy animation libraries** — Use CSS transitions for simple hover effects

## What I Should Be Able to Do Afterward

- [ ] Build mobile-first responsive layouts with Tailwind
- [ ] Use Framer Motion for page transitions and micro-interactions
- [ ] Handle the mobile sidebar/navigation pattern
- [ ] Respect `prefers-reduced-motion` accessibility preference
- [ ] Create smooth, subtle animations that enhance UX
