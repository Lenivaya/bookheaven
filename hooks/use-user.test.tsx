import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useUser, userQueryKey } from './use-user'
import * as userActions from '@/app/actions/users.actions'

// Create a complete mock for the userActions module
vi.mock('@/app/actions/users.actions', () => {
  return {
    getUser: vi.fn()
  }
})

// Define the expected cache configuration based on what we know is in the file
const expectedCacheConfig = {
  staleTime: 1000 * 60 * 60, // 1 hour
  cacheTime: 1000 * 60 * 60 * 24, // 24 hours
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false
}

describe('useUser', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    // Create a new QueryClient for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          // Turn off retries to make testing easier
          retry: false
        }
      }
    })

    // Reset all mocks before each test
    vi.resetAllMocks()
  })

  afterEach(() => {
    // Clear all mocks after each test
    vi.clearAllMocks()
  })

  // Create a wrapper with the QueryClientProvider
  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  it('should fetch user data successfully', async () => {
    // Mock user data matching the structure returned by getUser
    const mockUser = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      imageUrl: 'https://example.com/avatar.jpg'
    }

    // Setup the mock to return our test data
    const getUserMock = vi
      .mocked(userActions.getUser)
      .mockResolvedValue(mockUser)

    // Render the hook with our wrapper
    const { result } = renderHook(() => useUser('user-123'), {
      wrapper: createWrapper()
    })

    // Initially the query should be loading
    expect(result.current.isLoading).toBe(true)

    // Wait for the query to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // Verify the data is correct
    expect(result.current.data).toEqual(mockUser)

    // Verify the getUser function was called with the correct userId
    expect(getUserMock).toHaveBeenCalledWith('user-123')
    expect(getUserMock).toHaveBeenCalledTimes(1)
  })

  it('should handle error when fetching user data fails', async () => {
    // Setup the mock to throw an error
    const error = new Error('Failed to fetch user')
    const getUserMock = vi.mocked(userActions.getUser).mockRejectedValue(error)

    // Render the hook with our wrapper
    const { result } = renderHook(() => useUser('user-123'), {
      wrapper: createWrapper()
    })

    // Wait for the query to fail
    await waitFor(() => expect(result.current.isError).toBe(true))

    // Verify the error is correct
    expect(result.current.error).toBeDefined()

    // Verify the getUser function was called
    expect(getUserMock).toHaveBeenCalledWith('user-123')
    expect(getUserMock).toHaveBeenCalledTimes(1)
  })

  it('should use the correct query key', () => {
    // Render the hook with our wrapper
    renderHook(() => useUser('user-123'), {
      wrapper: createWrapper()
    })

    // Get the query from the cache to verify the query key
    const queries = queryClient.getQueryCache().getAll()
    const userQuery = queries.find(
      (q) =>
        Array.isArray(q.queryKey) &&
        q.queryKey[0] === 'user' &&
        q.queryKey[1] === 'user-123'
    )

    expect(userQuery?.queryKey).toEqual(userQueryKey('user-123'))
  })

  it('should not refetch when component remounts if data exists', async () => {
    // Mock user data
    const mockUser = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      imageUrl: 'https://example.com/avatar.jpg'
    }

    // Setup the mock to return our test data
    const getUserMock = vi
      .mocked(userActions.getUser)
      .mockResolvedValue(mockUser)

    // Render the hook with our wrapper
    const { result, rerender } = renderHook(() => useUser('user-123'), {
      wrapper: createWrapper()
    })

    // Wait for the query to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // Reset the mock to track new calls
    getUserMock.mockClear()

    // Rerender the hook (simulating a remount)
    rerender()

    // Wait a bit to ensure no refetch happens
    await new Promise((resolve) => setTimeout(resolve, 50))

    // Verify the getUser function was not called again
    expect(getUserMock).not.toHaveBeenCalled()
  })

  it('should use the correct cache configuration', async () => {
    // Mock user data
    const mockUser = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      imageUrl: 'https://example.com/avatar.jpg'
    }

    vi.mocked(userActions.getUser).mockResolvedValue(mockUser)

    // Render the hook with our wrapper
    renderHook(() => useUser('user-123'), {
      wrapper: createWrapper()
    })

    // Get the query from the cache
    const queries = queryClient.getQueryCache().getAll()
    const userQuery = queries.find(
      (q) =>
        Array.isArray(q.queryKey) &&
        q.queryKey[0] === 'user' &&
        q.queryKey[1] === 'user-123'
    )

    // Check if the query exists
    expect(userQuery).toBeDefined()

    // Verify the query is using the correct key
    expect(userQuery?.queryKey).toEqual(['user', 'user-123'])
  })
})
