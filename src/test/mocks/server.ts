/**
 * Node.js MSW server used by Vitest (jsdom environment).
 *
 * Started/stopped globally in `src/test/setup.ts` so every test file
 * gets network interception without any extra boilerplate.
 */
import { setupServer } from 'msw/node';

import { handlers } from './handlers';

export const server = setupServer(...handlers);
