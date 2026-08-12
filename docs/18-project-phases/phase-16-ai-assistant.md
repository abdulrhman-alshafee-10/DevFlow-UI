# Phase 16 — AI Assistant UI

## Objective

Integrate the AI capabilities by building advanced features such as Task Analysis, Project Summarization, and a conversational chat interface that supports Server-Sent Events (SSE) for streaming text generation.

---

## Concepts Learned

- Server-Sent Events (SSE) in React
- Managing streaming string state
- Rendering markdown with syntax highlighting from an AI source

**Relevant docs**:
- `11-ai/chat-streaming.md`

---

## Features After This Phase

- [ ] "Ask AI" chat assistant on task details and global dashboard
- [ ] "Analyze Task" button that streams a breakdown of task complexity and risks
- [ ] "Summarize Project" button on the project dashboard that streams status and blockers
- [ ] "Generate Subtasks" button that automatically creates actionable subtasks using AI
- [ ] Markdown and code block rendering in all AI responses

---

## API Endpoints Handled

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/v1/ai/chat` | SSE endpoint for general AI chat |
| POST | `/api/v1/ai/tasks/{id}/analyze` | Analyze a task (streaming) |
| POST | `/api/v1/ai/projects/{id}/summarize` | Summarize a project (streaming) |
| POST | `/api/v1/ai/tasks/{id}/suggest-subtasks` | Generate subtasks (JSON) |

---

## Completion Checklist

- [ ] Build the `AIChat` component for the general assistant
- [ ] Create the `useAIStream` hook using the native `EventSource` API for streaming
- [ ] Install `react-markdown` and `react-syntax-highlighter`
- [ ] Add the "Analyze Task" button to the Task Details page and wire it to the analyze endpoint
- [ ] Add the "Summarize Project" button to the Project Dashboard
- [ ] Add the "Generate Subtasks" feature and render the suggestions as clickable items to create them
- [ ] Ensure all streaming UI auto-scrolls to the bottom as new text streams in
