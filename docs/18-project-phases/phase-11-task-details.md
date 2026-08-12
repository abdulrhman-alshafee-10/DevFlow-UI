# Phase 11 — Task Details & Intercepting Routes

## Objective

Provide a detailed view of a task. When clicking a task on the board, it should open in a modal (using Next.js Intercepting Routes) but also have its own dedicated page URL for sharing.

---

## Concepts Learned

- Next.js Intercepting Routes (`(..)`)
- Next.js Parallel Routes (`@modal`)
- Rich text editing or Markdown rendering
- Editable inline fields

---

## Features After This Phase

- [ ] Clicking a task opens a Modal without losing the background board context
- [ ] Copying the URL and opening in a new tab shows the full Task Page
- [ ] Inline editing of task title, description, priority, and assignee
- [ ] Display task activity/history (Audit Log Timeline) showing old vs new values

---

## API Endpoints Handled

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/tasks/{id}` | Get full task details |
| PATCH | `/api/v1/tasks/{id}` | Update specific fields |
| GET | `/api/v1/tasks/{id}/history` | Get audit log |

---

## Completion Checklist

- [ ] Set up the parallel route `@modal` in the project layout
- [ ] Create the intercepting route `(..)tasks/[taskId]` for the modal view
- [ ] Create the standard route `tasks/[taskId]` for the full page view
- [ ] Implement inline editing components (e.g., clicking the title turns it into an input)
- [ ] Build the `TaskHistoryTimeline` component to parse and render audit log JSONB data
- [ ] Fetch and display the task history timeline alongside the task details
