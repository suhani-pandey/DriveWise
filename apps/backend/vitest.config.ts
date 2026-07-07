import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/unit/**/*.spec.ts', 'test/integration/**/*.spec.ts'],
    environment: 'node',
  },
});
