# Phase 9 — Projects UI

## Objective

Build the interface for managing projects within an organization. This includes listing projects, viewing project details, creating new projects, and project settings.

---

## Concepts Learned

- Master-detail view patterns
- Grid vs List view toggles
- Optimistic updates when creating/deleting projects

---

## Features After This Phase

- [ ] Project list view (grid of cards or table list)
- [ ] Create Project modal
- [ ] Project details wrapper (layout for the project dashboard, tasks, settings)
- [ ] Project Settings page (update details, archive, delete)

---

## API Endpoints Handled

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/organizations/{org_id}/projects` | List projects |
| POST | `/api/v1/organizations/{org_id}/projects` | Create project |
| GET | `/api/v1/projects/{id}` | Get project details |
| PATCH | `/api/v1/projects/{id}` | Update project |
| DELETE | `/api/v1/projects/{id}` | Delete project |

---

## Completion Checklist

- [ ] Build the `/projects` page listing all projects for the current org
- [ ] Implement the `ProjectCard` component
- [ ] Build the `CreateProjectModal` using React Hook Form
- [ ] Set up the nested layout `app/(dashboard)/projects/[projectId]/layout.tsx` for project-specific navigation (Board, List, Settings)
- [ ] Build the project settings page
- [ ] Implement optimistic updates in React Query when creating or deleting a project
