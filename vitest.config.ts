import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Test environment
    environment: 'jsdom', // For DOM APIs (window, navigator, screen)

    // Global test settings
    globals: true, // Enable global test APIs (describe, it, expect)

    // Coverage configuration
    coverage: {
      provider: 'v8', // Use V8 coverage provider (faster than istanbul)
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts', 'src/types/**', 'src/**/*.test.ts', 'src/**/*.spec.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },

    // Test file patterns
    include: ['tests/**/*.test.ts', 'tests/**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],

    // Test timeouts
    testTimeout: 10000, // 10 seconds
    hookTimeout: 10000,

    // Reporter configuration
    reporters: ['default'],

    // Isolate tests for reliability
    isolate: true,
  },
});
