# API Integration — Client Setup

## What Is It?

The **API client layer** is a centralized module that handles all communication between the Next.js frontend and the FastAPI backend. It manages base URLs, authentication headers, token refresh, error handling, and type-safe request/response contracts.

## Why Does It Matter?

- **Centralized configuration** — One place to configure headers, base URL, interceptors
- **Automatic auth** — Tokens are attached to every request automatically
- **Token refresh** — Expired access tokens are refreshed transparently
- **Type safety** — Every API call has typed request and response
- **Consistent errors** — All API errors are handled the same way

## How Does It Fit into DevFlow?

### API Client Setup

```typescript
// lib/api/client.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Send cookies
});

// Request interceptor — attach token
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch {
        // Refresh failed — redirect to login
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

### Type-Safe API Functions

```typescript
// lib/api/tasks.ts
import apiClient from "./client";
import type { Task, TaskCreate, TaskUpdate, PaginatedResponse } from "@/types";

export const tasksApi = {
  list: async (projectId: string, params?: TaskQueryParams) => {
    const { data } = await apiClient.get<PaginatedResponse<Task>>(
      `/api/v1/projects/${projectId}/tasks`,
      { params }
    );
    return data;
  },

  get: async (taskId: string) => {
    const { data } = await apiClient.get<Task>(`/api/v1/tasks/${taskId}`);
    return data;
  },

  create: async (projectId: string, payload: TaskCreate) => {
    const { data } = await apiClient.post<Task>(
      `/api/v1/projects/${projectId}/tasks`,
      payload
    );
    return data;
  },

  update: async (taskId: string, payload: TaskUpdate) => {
    const { data } = await apiClient.patch<Task>(
      `/api/v1/tasks/${taskId}`,
      payload
    );
    return data;
  },

  delete: async (taskId: string) => {
    await apiClient.delete(`/api/v1/tasks/${taskId}`);
  },
};
```

### Error Handling

```typescript
// lib/api/errors.ts
import { AxiosError } from "axios";

interface ApiError {
  detail: string;
  code: string;
  field?: string;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiError;
    return data?.detail || "An unexpected error occurred";
  }
  return "An unexpected error occurred";
}
```

## Common Mistakes

1. **Hardcoding base URL** — Use environment variables
2. **No token refresh** — Users get logged out when the access token expires
3. **Not typing responses** — API responses without TypeScript types
4. **Inconsistent error handling** — Different error formats in different components

## What I Should Be Able to Do Afterward

- [ ] Set up Axios with interceptors for auth and error handling
- [ ] Create type-safe API functions for all backend endpoints
- [ ] Implement automatic token refresh on 401 responses
- [ ] Handle API errors consistently across the application
- [ ] Use environment variables for API configuration
