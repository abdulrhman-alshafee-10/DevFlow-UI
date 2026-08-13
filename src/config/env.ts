/**
 * Type-safe access to public environment variables.
 *
 * In later phases this can be replaced by a stricter runtime schema
 * (e.g. Zod) once server-only secrets are introduced.
 */
export const env = {
  APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000',
  WS_URL: process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8000',
  ENABLE_DEBUG: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
} as const;

export type AppEnv = typeof env;
