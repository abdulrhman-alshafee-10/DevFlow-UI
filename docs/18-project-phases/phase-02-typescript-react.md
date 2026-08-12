# Phase 2 — TypeScript & React Components

## Objective

Build out the remaining core design system components using React and TypeScript. Focus on creating flexible, reusable, and type-safe components that will be used throughout the application.

---

## Concepts Learned

- React component composition
- TypeScript generics in components
- Radix UI primitive integration
- Controlled vs uncontrolled components
- Compound component pattern

**Relevant docs**:
- `01-typescript/advanced-types.md`
- `02-react/core-concepts.md`
- `02-react/component-patterns.md`

---

## Features After This Phase

- [ ] Complete set of foundational UI components
- [ ] Accessible Dropdown Menu
- [ ] Accessible Modal/Dialog
- [ ] Typography components
- [ ] Badge and Avatar components
- [ ] Toast notification system UI

---

## API Integration

**None** — Still building the UI layer independently.

---

## Component Requirements

### 1. `Modal` (Dialog)
- Built on `@radix-ui/react-dialog`
- Subcomponents: `Modal`, `ModalTrigger`, `ModalContent`, `ModalHeader`, `ModalFooter`, `ModalTitle`
- Esc key and outside click to close

### 2. `DropdownMenu`
- Built on `@radix-ui/react-dropdown-menu`
- Subcomponents: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuSeparator`

### 3. `Badge` and `Avatar`
- Badge variants matching DevFlow priorities/statuses
- Avatar with fallback initials if no image is provided

### 4. `Toast`
- Built on `@radix-ui/react-toast` or `sonner`
- Success, error, and info variants

---

## Testing Requirements

- Verify all components render correctly in Storybook or a test page
- Ensure Radix components trap focus correctly when open
- Ensure keyboard navigation works for Dropdowns and Modals

---

## Completion Checklist

- [ ] Install Radix UI primitives (`@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, etc.)
- [ ] Create `Avatar` component
- [ ] Create `Badge` component with status colors
- [ ] Create `Modal` compound component
- [ ] Create `DropdownMenu` compound component
- [ ] Set up the `Toaster` provider in the root layout
- [ ] Add examples of all new components to the landing page (`page.tsx`) to verify them
