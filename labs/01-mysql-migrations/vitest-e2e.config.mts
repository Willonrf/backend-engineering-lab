import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/migration-integrity.e2e-spec.ts'],
    globals: true,
    root: './',
  },
});
