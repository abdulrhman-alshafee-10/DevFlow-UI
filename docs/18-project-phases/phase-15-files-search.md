# Phase 15 — File Uploads & Search

## Objective

Add advanced interactions: attaching files to tasks and implementing the global command palette search.

---

## Concepts Learned

- Drag-and-drop file zones with `react-dropzone`
- Handling `multipart/form-data` in Axios
- Global keyboard shortcuts
- Debouncing search inputs

**Relevant docs**:
- `09-files/uploads-previews.md`
- `10-search/global-search.md`

---

## Features After This Phase

- [ ] Drag-and-drop file upload zone in the task details
- [ ] Preview list of attached files with icons and download links
- [ ] Cmd+K / Ctrl+K opens a global search modal anywhere in the app
- [ ] Search results show tasks, projects, and users

---

## API Endpoints Handled

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/v1/tasks/{id}/attachments` | Upload file |
| GET | `/api/v1/search` | Global search query |

---

## Completion Checklist

- [ ] Install `react-dropzone`
- [ ] Build the `FileUploadZone` component
- [ ] Wire it to the file upload API endpoint using FormData
- [ ] Build the `CommandPalette` component using Radix Dialog
- [ ] Add the global keyboard event listener for `Cmd+K`
- [ ] Implement debounced fetching from the `/api/v1/search` endpoint
