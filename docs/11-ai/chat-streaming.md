# AI Integration — Chat UI & Streaming

## What Is It?

The **AI assistant UI** provides a chat-like interface where users can interact with the LLM-powered features of DevFlow. It supports **streaming responses** (tokens appear word-by-word), **context awareness** (current task/project), and **markdown rendering**.

## Why Does It Matter?

- **Productivity** — Users get AI-powered task suggestions, summaries, and analysis
- **Modern UX** — Streaming responses feel responsive and conversational
- **Context** — AI can analyze the current task, project, or sprint

## How Does It Fit into DevFlow?

### AI Chat Interface

```tsx
"use client";

export function AIChat({ context }: { context?: TaskContext }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const { response, isStreaming, startStream } = useAIStream();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    startStream(input, context);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [response, messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <ChatBubble key={i} message={msg} />
        ))}
        {isStreaming && (
          <ChatBubble message={{ role: "assistant", content: response }} />
        )}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t p-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI about this task..."
          disabled={isStreaming}
        />
      </form>
    </div>
  );
}
```

### Markdown Rendering for AI Responses

```tsx
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

function ChatBubble({ message }: { message: ChatMessage }) {
  return (
    <div className={cn(
      "rounded-lg p-3 max-w-[80%]",
      message.role === "user"
        ? "ml-auto bg-primary text-white"
        : "bg-muted"
    )}>
      <ReactMarkdown
        components={{
          code({ className, children }) {
            const language = className?.replace("language-", "");
            return (
              <SyntaxHighlighter language={language}>
                {String(children)}
              </SyntaxHighlighter>
            );
          },
        }}
      >
        {message.content}
      </ReactMarkdown>
    </div>
  );
}
```

## Common Mistakes

1. **Not streaming** — Waiting for the full response is slow UX
2. **No markdown support** — AI returns markdown; render it properly
3. **No loading indicator** — Show a typing indicator while waiting
4. **No error handling** — Handle API errors and rate limits gracefully

## What I Should Be Able to Do Afterward

- [ ] Build a chat interface with streaming responses
- [ ] Render markdown in AI responses with syntax highlighting
- [ ] Send context (current task/project) with AI requests
- [ ] Handle streaming errors and connection issues
- [ ] Implement a typing indicator during AI responses
