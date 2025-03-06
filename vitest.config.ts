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
        'db'
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
