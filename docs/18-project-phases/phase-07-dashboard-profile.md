# Phase 7 — Dashboard & User Profile

## Objective

Build the main dashboard view providing an overview of the user's workload, and create the user profile and security settings pages.

---

## Concepts Learned

- React Query for fetching multiple resources concurrently
- Building dashboard widgets (metrics, recent items)
- Form handling for updating user profiles (PATCH requests)

---

## Features After This Phase

- [ ] Dashboard shows a high-level summary (e.g., tasks due soon, recent projects)
- [ ] Profile Settings tab to update name and view account details
- [ ] Ability to upload or change avatar (placeholder UI for now, fully implemented in Phase 15)
- [ ] Security Settings tab to manage passwords and active sessions
- [ ] Form to change password (requires current password)

---

## API Endpoints Handled

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/users/me/dashboard` | Fetch aggregated dashboard metrics |
| PATCH | `/api/v1/users/me` | Update user profile |
| POST | `/api/v1/auth/change-password` | Update user password |

---

## Completion Checklist

- [ ] Build the `/dashboard` landing page
- [ ] Implement `DashboardWidget` components for reusability
- [ ] Fetch and display "Tasks Due Soon" on the dashboard
- [ ] Create the `/settings` page layout with tabs (Profile, Security)
- [ ] Build the `ProfileUpdateForm` using React Hook Form and Zod
- [ ] Connect the profile form to the PATCH endpoint and update Zustand state on success
- [ ] Build the `ChangePasswordForm` in the Security tab
- [ ] Connect the change password form to the API endpoint
