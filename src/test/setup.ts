import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';

import { server } from './mocks/server';

// Start MSW before all tests in this file
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// Reset handlers after each test so overrides don't bleed across tests
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

// Clean up after all tests
afterAll(() => server.close());
