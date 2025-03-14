import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    coverage: {
      enabled: true,
      exclude: [
        'node_modules',
        'dist',
        'next.config.ts',
        'postcss.config.mjs',
        'eslint.config.mjs',
        'next-env.d.ts',
        'vitest.config.ts',
        'db/*',
        'env.ts',
        'types/*',
        '.next/*',
        'public/*',
        // Configuration files
        'drizzle.config.ts',
        'instrumentation.ts',
        'middleware.ts',
        'sentry.client.config.ts',
        'sentry.edge.config.ts',
        'sentry.server.config.ts',
        // Storybook files
        '.storybook/**',
        '**/*.stories.tsx',
        // Generated coverage files
        'coverage/**',
        // API routes
        'app/api/**',
        // Next.js special files
        '**/layout.tsx',
        '**/global-error.tsx',
        '**/error.tsx',
        '**/loading.tsx',
        '**/not-found.tsx',
        // Utility files that are imported by the app
        'lib/stripe/stripe.ts',
        'lib/constants/**',
        // Scripts
        'scripts/*'
      ],
      reporter: ['html', 'json-summary', 'json', 'text'],
      provider: 'v8',
      reportOnFailure: true,
      thresholds: {
        branches: 40,
        functions: 40,
        lines: 40,
        statements: 40
      }
    }
  }
})
