# Phase 12 — Comments & Activity

## Objective

Enable collaboration by allowing users to comment on tasks. Implement a threaded or linear discussion view within the task details.

---

## Concepts Learned

- Infinite scrolling or pagination for comments
- Rich text input or Markdown support for writing comments
- Deleting/Editing own comments

---

## Features After This Phase

- [ ] Comment thread at the bottom of the task details
- [ ] Markdown editor for creating comments
- [ ] Ability to edit or delete your own comments
- [ ] Markdown rendering for viewing comments

---

## API Endpoints Handled

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/tasks/{id}/comments` | List comments |
| POST | `/api/v1/tasks/{id}/comments` | Add comment |
| PATCH | `/api/v1/comments/{id}` | Edit comment |
| DELETE | `/api/v1/comments/{id}` | Delete comment |

---

## Completion Checklist

- [ ] Install `react-markdown` for rendering comments
- [ ] Build the `CommentList` component
- [ ] Build the `CommentInput` component (textarea with markdown support)
- [ ] Implement `CreateComment`, `UpdateComment`, and `DeleteComment` mutations
- [ ] Ensure users can only edit/delete their own comments (UI conditionally rendering action buttons)
