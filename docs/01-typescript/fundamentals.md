# TypeScript — Fundamentals

## What Is It?

TypeScript is a **statically typed superset of JavaScript** developed by Microsoft. It adds optional type annotations to JavaScript, enabling compile-time error checking and better developer tooling. Every valid JavaScript file is also valid TypeScript.

## Why Does It Matter?

- **Catches bugs before runtime** — Type errors are caught during development, not in production
- **Self-documenting code** — Types serve as living documentation for functions and data structures
- **Better IDE support** — Autocomplete, refactoring, and go-to-definition work perfectly
- **Team scalability** — Types act as contracts between different parts of the codebase
- **API confidence** — When backend and frontend share types, mismatches are caught instantly

## When Should I Use It?

- Any project larger than a quick script
- When working in a team
- When consuming APIs (type your responses!)
- When building reusable libraries or components

## When Should I NOT Use It?

- Quick prototypes that will be thrown away
- Small scripts where the overhead isn't worth it
- When you're learning JavaScript basics (learn JS first, then TS)

## How Does It Work?

TypeScript compiles down to plain JavaScript. The type system is **erased** at runtime — types only exist during development and compilation.

```typescript
// TypeScript (development)
function greet(name: string): string {
  return `Hello, ${name}`;
}

// JavaScript (compiled output)
function greet(name) {
  return `Hello, ${name}`;
}
```

## How Does It Fit into DevFlow?

- **API types** — Define TypeScript interfaces that match your FastAPI Pydantic schemas
- **Component props** — Type every component's props for safety and documentation
- **State management** — Type your Zustand stores and React Query responses
- **Form validation** — Zod schemas that infer TypeScript types
- **API client** — Type-safe API calls that match backend endpoints

## Common Mistakes

1. **Overusing `any`** — Defeats the purpose of TypeScript entirely
2. **Not typing API responses** — Leads to runtime errors when the API changes
3. **Ignoring strict mode** — Enable `strict: true` in tsconfig from the start
4. **Type assertion abuse** — Using `as` to silence errors instead of fixing types
5. **Not using utility types** — Rewriting types instead of using `Partial`, `Pick`, `Omit`

## Production Considerations

- Enable `strict: true` in `tsconfig.json`
- Set `noUncheckedIndexedAccess: true` for safer array/object access
- Use `exactOptionalPropertyTypes: true` in strict projects
- Keep TypeScript version updated for latest features and performance

## Prerequisites

- JavaScript fundamentals (variables, functions, objects, arrays, classes)
- ES6+ features (arrow functions, destructuring, spread, modules)
- Basic understanding of JSON and object structures

## What I Should Be Able to Do Afterward

- [ ] Annotate function parameters, return types, and variables
- [ ] Define interfaces and type aliases for complex data
- [ ] Use generics to create flexible, reusable types
- [ ] Apply utility types (Partial, Pick, Omit, Record, Readonly)
- [ ] Handle union types, intersection types, and discriminated unions
- [ ] Configure tsconfig.json with strict settings
- [ ] Convert JavaScript code to TypeScript
