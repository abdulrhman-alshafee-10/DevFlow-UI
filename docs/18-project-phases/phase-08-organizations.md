# Phase 8 — Organizations UI

## Objective

Implement the multi-tenant architecture in the UI. Users must be able to create organizations, switch between them, and manage members if they have the appropriate role.

---

## Concepts Learned

- Organization context switching
- Managing active state in Zustand across API calls
- Data tables with pagination for member lists
- Role-based UI rendering (Admin vs Member views)

---

## Features After This Phase

- [ ] Organization switcher dropdown in the Topbar or Sidebar
- [ ] Page to create a new Organization
- [ ] Organization Settings page (edit name, delete org)
- [ ] Member management table (list, invite, change roles, remove)

---

## API Endpoints Handled

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/organizations` | List user's organizations |
| POST | `/api/v1/organizations` | Create an organization |
| GET | `/api/v1/organizations/{id}/members` | List members of an org |
| POST | `/api/v1/organizations/{id}/invitations` | Invite a user to the org |

---

## Completion Checklist

- [ ] Implement the `OrganizationSwitcher` component
- [ ] Update Axios interceptor to optionally include the `X-Organization-Id` header (if required by backend design) or ensure all routes specify the org context
- [ ] Build the `/organizations/new` page
- [ ] Build the `/organizations/[id]/settings` page
- [ ] Build the `/organizations/[id]/members` page with a paginated `DataTable`
- [ ] Implement the invite member modal
- [ ] Ensure only Admins/Owners see the settings and invite buttons using `PermissionGate`
