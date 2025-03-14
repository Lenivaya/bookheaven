import { vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

// Mock the env module
vi.mock('./env.ts', () => ({
  env: {
    // Add any environment variables needed for tests
    NODE_ENV: 'test',
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'test-clerk-key',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'test-stripe-key',
    NEXT_PUBLIC_APP_URL: 'http://localhost:3000'
  }
}))

// Mock any other modules that might cause issues in tests
