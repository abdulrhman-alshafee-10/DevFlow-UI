import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const resolveFromRoot = (relativePath: string): string =>
  fileURLToPath(new URL(relativePath, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolveFromRoot('./src'),
      '@/app': resolveFromRoot('./src/app'),
      '@/components': resolveFromRoot('./src/components'),
      '@/config': resolveFromRoot('./src/config'),
      '@/hooks': resolveFromRoot('./src/hooks'),
      '@/lib': resolveFromRoot('./src/lib'),
      '@/styles': resolveFromRoot('./src/styles'),
      '@/types': resolveFromRoot('./src/types'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    css: false,
    passWithNoTests: true,
  },
});
