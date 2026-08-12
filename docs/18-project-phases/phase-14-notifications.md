# Phase 14 — Notifications UI

## Objective

Build the notification center to alert users about assignments, mentions, and updates. This relies on the WebSocket connection from Phase 13 for live delivery.

---

## Concepts Learned

- Infinite scrolling or pagination for notification history
- Toast notifications for real-time alerts
- Optimistic updates for marking notifications as read

---

## Features After This Phase

- [ ] Notification bell icon in Topbar with an unread badge counter
- [ ] Dropdown or slide-out panel showing recent notifications
- [ ] Real-time toast notifications appear when the user is online
- [ ] Mark single or all notifications as read

---

## API Endpoints Handled

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/notifications` | List notifications |
| PATCH | `/api/v1/notifications/{id}/read` | Mark as read |
| POST | `/api/v1/notifications/read-all` | Mark all as read |

---

## Completion Checklist

- [ ] Build the `NotificationBell` component with unread counter
- [ ] Build the `NotificationList` dropdown/panel
- [ ] Hook up WebSocket `notification` events to trigger a Toast and invalidate the unread count query
- [ ] Implement the "Mark as Read" mutation
