# Phase 10 — Task Management (Kanban Board)

## Objective

Build the core feature of DevFlow: the Task Kanban Board. Implement drag-and-drop functionality for moving tasks between columns and reordering them.

---

## Concepts Learned

- Drag-and-drop interfaces using `@dnd-kit/core`
- Complex React Query data structures
- Optimistic updates for drag-and-drop
- Filtering and sorting lists

---

## Features After This Phase

- [ ] Kanban board view for a project
- [ ] Tasks grouped by status (Todo, In Progress, Review, Done)
- [ ] Drag tasks between columns to update status
- [ ] Drag tasks within a column to reorder
- [ ] Filter tasks by assignee, priority, or search term
- [ ] Create Task button that opens a modal

---

## API Endpoints Handled

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/projects/{id}/tasks` | List tasks |
| POST | `/api/v1/projects/{id}/tasks` | Create a task |
| PATCH | `/api/v1/tasks/{id}` | Update task status/position |

---

## Completion Checklist

- [ ] Install `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities`
- [ ] Build the `TaskCard` component
- [ ] Build the `TaskBoard` and `TaskColumn` components
- [ ] Implement the DndContext and handle `onDragEnd` events
- [ ] Implement optimistic UI updates when a task is dropped in a new column
- [ ] Build the `CreateTaskModal`
- [ ] Add a filter bar above the board (Assignee dropdown, Priority dropdown)
