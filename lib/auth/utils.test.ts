import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { checkRole } from './utils'
import { auth } from '@clerk/nextjs/server'

// Mock the auth module from Clerk
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn()
}))

describe('checkRole', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return true when user has the specified role', async () => {
    // Mock the auth function to return a user with 'admin' role
    vi.mocked(auth).mockResolvedValue({
      sessionClaims: {
        metadata: {
          role: 'admin'
        }
      }
    } as any)

    const result = await checkRole('admin')

    expect(result).toBe(true)
    expect(auth).toHaveBeenCalledTimes(1)
  })

  it('should return false when user has a different role', async () => {
    // Mock the auth function to return a user with 'moderator' role
    vi.mocked(auth).mockResolvedValue({
      sessionClaims: {
        metadata: {
          role: 'moderator'
        }
      }
    } as any)

    const result = await checkRole('admin')

    expect(result).toBe(false)
    expect(auth).toHaveBeenCalledTimes(1)
  })

  it('should return false when user has no role', async () => {
    // Mock the auth function to return a user with no role
    vi.mocked(auth).mockResolvedValue({
      sessionClaims: {
        metadata: {}
      }
    } as any)

    const result = await checkRole('admin')

    expect(result).toBe(false)
    expect(auth).toHaveBeenCalledTimes(1)
  })

  it('should return false when sessionClaims is undefined', async () => {
    // Mock the auth function to return no sessionClaims
    vi.mocked(auth).mockResolvedValue({
      sessionClaims: undefined
    } as any)

    const result = await checkRole('admin')

    expect(result).toBe(false)
    expect(auth).toHaveBeenCalledTimes(1)
  })

  it('should handle all valid role types', async () => {
    // Test with 'moderator' role
    vi.mocked(auth).mockResolvedValue({
      sessionClaims: {
        metadata: {
          role: 'moderator'
        }
      }
    } as any)

    const result = await checkRole('moderator')

    expect(result).toBe(true)
    expect(auth).toHaveBeenCalledTimes(1)
  })
})
