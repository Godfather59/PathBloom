import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./src/logic/__tests__/setup.js'],
    environment: 'node',
  },
});
