# Phase 5 — Authentication UI

## Objective

Build the complete authentication suite using React Hook Form and Zod for validation, and connect them to the backend API. This includes Login, Registration, Email Verification, Password Resets, and Session Management.

---

## Concepts Learned

- React Hook Form integration
- Zod schema validation
- React Query mutations
- Error handling from API responses
- Client-side routing after authentication

**Relevant docs**:
- `05-state-management/forms-validation.md`
- `07-authentication/auth-flow.md`

---

## Features After This Phase

- [ ] Fully functional Login form with validation
- [ ] Fully functional Register form with validation
- [ ] Email Verification page (`/verify-email`) to process emailed tokens
- [ ] Forgot Password page to request a reset email
- [ ] Reset Password page (`/reset-password`) to input a new password using a token
- [ ] Display of backend error messages (e.g., "Invalid credentials")
- [ ] Loading states during submission
- [ ] Successful login stores user data in Zustand and redirects to `/dashboard`
- [ ] "Logout" and "Logout from all devices" buttons work

---

## API Endpoints Handled

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/v1/auth/login` | Authenticate user, receive HTTP-only cookies |
| POST | `/api/v1/auth/register` | Create new user account |
| GET | `/api/v1/auth/me` | Fetch current user profile |
| POST | `/api/v1/auth/logout` | Clear HTTP-only cookies for current session |
| POST | `/api/v1/auth/logout-all` | Clear all sessions |
| POST | `/api/v1/auth/verify-email` | Verify email with token |
| POST | `/api/v1/auth/forgot-password` | Request password reset email |
| POST | `/api/v1/auth/reset-password` | Reset password using token |

---

## Component Requirements

### 1. `LoginForm`
- Fields: Email, Password
- Validation: Valid email, password required
- On success: Call `setUser` in auth store, `router.push('/dashboard')`

### 2. `RegisterForm`
- Fields: Full Name, Email, Password, Confirm Password
- Validation: Passwords must match, valid email, strong password
- On success: Redirect to login or automatically log in

### 3. `PasswordForms`
- `ForgotPasswordForm`: Requests email.
- `ResetPasswordForm`: Takes token from URL params and sets new password.

### 4. `AuthHook`
- Create a `useAuth` hook that encapsulates login, logout, logoutAll, and session state.

---

## Completion Checklist

- [ ] Install `react-hook-form`, `zod`, and `@hookform/resolvers`
- [ ] Create Zod schemas for all auth forms (login, register, reset password)
- [ ] Build the `LoginForm` and `RegisterForm` components
- [ ] Build the `VerifyEmail` component (handles token automatically from URL)
- [ ] Build the `ForgotPasswordForm` and `ResetPasswordForm`
- [ ] Implement all `authApi` calls in `src/lib/api/auth.ts`
- [ ] Create the `useAuth` custom hook handling mutations
- [ ] Wire up the forms in their respective pages (`/login`, `/register`, `/verify-email`, etc.)
- [ ] Wire up the logout and logout-all buttons
- [ ] Fetch the current user (`/auth/me`) when the app loads to restore session
