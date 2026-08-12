# Phase 13 — Real-time Updates

## Objective

Make the application feel alive by connecting to the backend WebSocket and updating the UI instantly when other users make changes.

---

## Concepts Learned

- React WebSocket integration
- Reconnection and heartbeat strategies
- React Query cache invalidation based on socket events

**Relevant docs**:
- `08-realtime/websockets-sse.md`

---

## Features After This Phase

- [ ] Task board updates automatically when another user moves a task
- [ ] Comments appear instantly without refreshing
- [ ] Connection status indicator (Connected/Disconnected)

---

## API Endpoints Handled

| Method | Path | Purpose |
|---|---|---|
| WS | `/ws/{org_id}` | Establish WebSocket connection |

---

## Completion Checklist

- [ ] Create the `useWebSocket` custom hook
- [ ] Implement auto-reconnection logic on disconnect
- [ ] Connect the WebSocket provider in the dashboard layout
- [ ] Map incoming WebSocket events (e.g., `task_updated`) to `queryClient.invalidateQueries`
- [ ] Add a small connection status dot in the Topbar (Green = connected, Red = disconnected)
