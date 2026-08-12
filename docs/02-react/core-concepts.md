# React — Core Concepts

## What Is It?

React is a **JavaScript library for building user interfaces**. It uses a **component-based architecture** where the UI is broken into reusable, composable pieces. React uses a **virtual DOM** to efficiently update only the parts of the page that change.

## Why Does It Matter?

- **Component reuse** — Write once, use everywhere
- **Declarative UI** — Describe what the UI should look like, React handles the updates
- **Massive ecosystem** — Thousands of libraries, tools, and resources
- **Industry demand** — The most widely used frontend library
- **Foundation for Next.js** — Next.js is built on top of React

## How Does It Work?

React uses a **one-way data flow**: data flows down from parent to child via props. When state changes, React re-renders only the affected components.

```
State changes → React re-renders → Virtual DOM diff → Minimal DOM updates
```

## How Does It Fit into DevFlow?

Every piece of UI in DevFlow is a React component:

- `<LoginForm />` — Authentication forms
- `<TaskCard />` — Individual task in a Kanban board
- `<Sidebar />` — Navigation sidebar
- `<CommentThread />` — Comments on a task
- `<NotificationBell />` — Real-time notification indicator

## Common Mistakes

1. **Prop drilling** — Passing props through many layers instead of using context or state management
2. **useEffect for everything** — Overusing effects when derived state or event handlers would work
3. **Not using keys properly** — Missing or incorrect keys in lists causing bugs
4. **State in wrong component** — Lifting state too high or keeping it too low
5. **Direct DOM manipulation** — Using `document.getElementById` instead of refs

## Prerequisites

- JavaScript ES6+ (arrow functions, destructuring, spread, modules, promises)
- HTML and CSS fundamentals
- Basic understanding of the browser DOM

## What I Should Be Able to Do Afterward

- [ ] Create functional components with props
- [ ] Use useState for local state management
- [ ] Use useEffect for side effects with proper cleanup
- [ ] Use useRef for DOM references and mutable values
- [ ] Handle events (onClick, onChange, onSubmit)
- [ ] Render lists with proper keys
- [ ] Implement conditional rendering patterns
- [ ] Pass data between parent and child components
