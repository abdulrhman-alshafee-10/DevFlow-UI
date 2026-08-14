const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

// ── Shared SSE helper ──────────────────────────────────────────────────────

/**
 * Reads active org id from the Zustand store at call-time.
 * Returns an empty string if there is none (unauthenticated contexts).
 */
async function getOrgHeader(): Promise<string> {
  if (typeof window === 'undefined') return '';
  const { useOrgStore } = await import('@/stores/org-store');
  return useOrgStore.getState().activeOrg?.id ?? '';
}

/**
 * Opens a POST-based SSE stream and calls `onChunk` for every
 * `data:` line received.
 *
 * Uses the Fetch API + `ReadableStream` — no `EventSource` (which only
 * supports GET). Returns an `AbortController` so callers can cancel the
 * stream at any time.
 *
 * Token format expected from the backend:
 *   `data: <token text>\n\n`
 * A `data: [DONE]` sentinel signals end-of-stream.
 */
export async function postStream(
  path: string,
  body: Record<string, unknown>,
  onChunk: (token: string) => void,
  signal: AbortSignal,
): Promise<void> {
  const orgId = await getOrgHeader();

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      ...(orgId ? { 'X-Organization-Id': orgId } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `HTTP ${res.status}`);
  }

  if (!res.body) throw new Error('No response body');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Process complete SSE lines
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? ''; // keep incomplete trailing line

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;

      const data = trimmed.slice('data:'.length).trim();
      if (data === '[DONE]') return;
      if (data) onChunk(data);
    }
  }
}

// ── Typed AI endpoints ─────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** Stream a chat response. `onChunk` receives incremental text tokens. */
export function streamChat(
  messages: ChatMessage[],
  context: Record<string, unknown> | undefined,
  onChunk: (token: string) => void,
  signal: AbortSignal,
) {
  return postStream('/api/v1/ai/chat', { messages, context }, onChunk, signal);
}

/** Stream a task analysis breakdown. */
export function streamTaskAnalysis(
  taskId: string,
  onChunk: (token: string) => void,
  signal: AbortSignal,
) {
  return postStream(`/api/v1/ai/tasks/${taskId}/analyze`, {}, onChunk, signal);
}

/** Stream a project summary. */
export function streamProjectSummary(
  projectId: string,
  onChunk: (token: string) => void,
  signal: AbortSignal,
) {
  return postStream(
    `/api/v1/ai/projects/${projectId}/summarize`,
    {},
    onChunk,
    signal,
  );
}

export interface SubtaskSuggestion {
  title: string;
  description: string;
  priority: string;
}

/** Fetch subtask suggestions (JSON, not streamed). */
export async function suggestSubtasks(
  taskId: string,
): Promise<SubtaskSuggestion[]> {
  const orgId = await getOrgHeader();

  const res = await fetch(
    `${BASE_URL}/api/v1/ai/tasks/${taskId}/suggest-subtasks`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(orgId ? { 'X-Organization-Id': orgId } : {}),
      },
      body: JSON.stringify({}),
    },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json() as Promise<SubtaskSuggestion[]>;
}
