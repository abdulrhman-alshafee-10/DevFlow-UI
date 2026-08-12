# Real-Time — WebSockets & Server-Sent Events

## What Is It?

**Real-time features** keep the UI synchronized with the server without the user manually refreshing. **WebSockets** provide bidirectional communication (chat, live updates). **Server-Sent Events (SSE)** provide one-way server-to-client streaming (notifications, AI responses).

## Why Does It Matter?

- **Live collaboration** — Multiple users see task changes instantly
- **Notifications** — Users receive alerts without refreshing
- **AI streaming** — Show AI responses word-by-word as they're generated
- **Presence** — Show who's online and what they're working on

## How Does It Fit into DevFlow?

### WebSocket Hook

```typescript
// hooks/use-websocket.ts
export function useWebSocket(url: string) {
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setStatus("connected");
    ws.onclose = () => {
      setStatus("disconnected");
      // Auto-reconnect after 3 seconds
      setTimeout(() => setStatus("connecting"), 3000);
    };
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleRealtimeEvent(message, queryClient);
    };

    return () => ws.close();
  }, [url, queryClient]);

  return { status, send: (data: unknown) => wsRef.current?.send(JSON.stringify(data)) };
}

function handleRealtimeEvent(event: RealtimeEvent, queryClient: QueryClient) {
  switch (event.type) {
    case "task_created":
    case "task_updated":
    case "task_deleted":
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      break;
    case "comment_added":
      queryClient.invalidateQueries({ queryKey: ["comments", event.task_id] });
      break;
    case "notification":
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      showToast(event.data);
      break;
  }
}
```

### SSE for AI Streaming

```typescript
// hooks/use-ai-stream.ts
export function useAIStream() {
  const [response, setResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const startStream = async (prompt: string) => {
    setIsStreaming(true);
    setResponse("");

    const eventSource = new EventSource(
      `/api/v1/ai/stream?prompt=${encodeURIComponent(prompt)}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "token") {
        setResponse(prev => prev + data.content);
      } else if (data.type === "done") {
        eventSource.close();
        setIsStreaming(false);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      setIsStreaming(false);
    };
  };

  return { response, isStreaming, startStream };
}
```

## Common Mistakes

1. **No reconnection logic** — WebSockets disconnect; always auto-reconnect
2. **Memory leaks** — Not closing connections on component unmount
3. **Not debouncing updates** — Too many real-time updates can flood the UI
4. **Ignoring connection state** — Show users when they're disconnected

## What I Should Be Able to Do Afterward

- [ ] Establish and manage WebSocket connections with auto-reconnect
- [ ] Process real-time events to update React Query cache
- [ ] Implement SSE for AI response streaming
- [ ] Show connection status indicators in the UI
- [ ] Handle reconnection gracefully with queued messages
