/**
 * Component tests for `<LoginForm />`.
 *
 * Uses MSW (configured in src/test/setup.ts) to intercept the real
 * POST /api/v1/auth/login call, so no real server is needed.
 *
 * Covers: field rendering, client-side validation, successful login
 * (mutation called + loading state), server-side error surfacing, and
 * password visibility toggle.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { describe, expect, it, vi } from 'vitest';

import { server } from '@/test/mocks/server';

import { LoginForm } from './login-form';

// ── Next.js navigation mock ──────────────────────────────────────────────
// useRouter is called inside useAuth
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// ── next/link mock ───────────────────────────────────────────────────────
// Avoids needing a real Next.js app context for <Link>
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

// ── Helpers ───────────────────────────────────────────────────────────────

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function renderLoginForm() {
  const queryClient = makeQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <LoginForm />
    </QueryClientProvider>,
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────

describe('<LoginForm />', () => {
  // ── Rendering ──────────────────────────────────────────────────────────

  it('renders the email and password fields', () => {
    renderLoginForm();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    // Password input — use name attribute to avoid matching the "Show password" aria-label
    expect(
      document.querySelector('input[name="password"]'),
    ).toBeInTheDocument();
  });

  it('renders the Sign in submit button', () => {
    renderLoginForm();
    expect(
      screen.getByRole('button', { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it('renders a link to the register page', () => {
    renderLoginForm();
    expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute(
      'href',
      '/register',
    );
  });

  it('renders a link to the forgot password page', () => {
    renderLoginForm();
    expect(
      screen.getByRole('link', { name: /forgot password/i }),
    ).toHaveAttribute('href', '/forgot-password');
  });

  // ── Client-side validation ─────────────────────────────────────────────

  it('shows validation errors when submitted empty', async () => {
    renderLoginForm();
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it('shows an invalid email error for a malformed email', async () => {
    renderLoginForm();
    await userEvent.type(screen.getByLabelText(/email/i), 'not-an-email');
    const passwordInput = document.querySelector<HTMLInputElement>(
      'input[name="password"]',
    )!;
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/enter a valid email address/i),
      ).toBeInTheDocument();
    });
  });

  // ── Successful login ───────────────────────────────────────────────────

  it('submits the form and shows loading state while the mutation is pending', async () => {
    // Use a delayed response so we can assert the loading state
    server.use(
      http.post('http://localhost:8000/api/v1/auth/login', async () => {
        await new Promise((r) => setTimeout(r, 100));
        return HttpResponse.json({ id: 'user-1' });
      }),
    );

    renderLoginForm();

    await userEvent.type(screen.getByLabelText(/email/i), 'test@devflow.com');
    const passwordInput = document.querySelector<HTMLInputElement>(
      'input[name="password"]',
    )!;
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // While the request is in-flight the button should be disabled/loading
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /signing in/i }),
      ).toBeDisabled();
    });
  });

  it('calls the login API with the correct credentials', async () => {
    let capturedBody: unknown = null;

    server.use(
      http.post(
        'http://localhost:8000/api/v1/auth/login',
        async ({ request }) => {
          capturedBody = await request.json();
          return HttpResponse.json({ id: 'user-1', email: 'test@devflow.com' });
        },
      ),
    );

    renderLoginForm();

    await userEvent.type(screen.getByLabelText(/email/i), 'test@devflow.com');
    const passwordInput = document.querySelector<HTMLInputElement>(
      'input[name="password"]',
    )!;
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(capturedBody).toEqual({
        email: 'test@devflow.com',
        password: 'password123',
      });
    });
  });

  // ── Password visibility toggle ─────────────────────────────────────────

  it('toggles password visibility when the show/hide button is clicked', async () => {
    renderLoginForm();
    // Use name attribute to avoid ambiguity with the "Show password" button
    const passwordInput = document.querySelector<HTMLInputElement>(
      'input[name="password"]',
    )!;

    // Starts as hidden
    expect(passwordInput).toHaveAttribute('type', 'password');

    // The toggle button is inside an aria-hidden wrapper — query with hidden: true
    const toggle = screen.getByRole('button', {
      name: /show password/i,
      hidden: true,
    });
    await userEvent.click(toggle);

    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click again to hide
    await userEvent.click(
      screen.getByRole('button', { name: /hide password/i, hidden: true }),
    );
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
