import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useLikeOptimistic } from './useLikeOptimistic'
import { toast } from 'sonner'

// Mock the toast module
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn()
  }
}))

describe('useLikeOptimistic', () => {
  let queryClient: QueryClient
  const mockItemId = 'item-123'
  const mockInitialLikesCount = 10
  const mockQueryKeyPrefix = 'testLike'

  // Mock functions
  const mockCheckLikeStatusFn = vi.fn()
  const mockToggleLikeFn = vi.fn()

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

  it('should initialize with the correct values', async () => {
    // Mock the check like status function to return false (not liked)
    mockCheckLikeStatusFn.mockResolvedValue(false)

    // Render the hook with our wrapper
    const { result } = renderHook(
      () =>
        useLikeOptimistic({
          itemId: mockItemId,
          initialLikesCount: mockInitialLikesCount,
          queryKeyPrefix: mockQueryKeyPrefix,
          checkLikeStatusFn: mockCheckLikeStatusFn,
          toggleLikeFn: mockToggleLikeFn
        }),
      {
        wrapper: createWrapper()
      }
    )

    // Initially, isLikeStatusLoading should be true
    expect(result.current.isLikeStatusLoading).toBe(true)

    // Initially, optimisticLikesCount should be the initialLikesCount
    expect(result.current.optimisticLikesCount).toBe(mockInitialLikesCount)

    // Wait for the query to complete
    await waitFor(() => expect(result.current.isLikeStatusLoading).toBe(false))

    // After loading, isLiked should be false (as mocked)
    expect(result.current.isLiked).toBe(false)

    // Verify the checkLikeStatusFn was called with the correct itemId
    expect(mockCheckLikeStatusFn).toHaveBeenCalledWith(mockItemId)
    expect(mockCheckLikeStatusFn).toHaveBeenCalledTimes(1)
  })

  it('should handle successful like toggle (from not liked to liked)', async () => {
    // Mock the check like status function to return false (not liked)
    mockCheckLikeStatusFn.mockResolvedValue(false)

    // Mock the toggle like function to resolve successfully
    mockToggleLikeFn.mockResolvedValue({ success: true })

    // Create a spy on queryClient methods to verify optimistic updates
    const setQueryDataSpy = vi.spyOn(queryClient, 'setQueryData')

    // Render the hook with our wrapper
    const { result } = renderHook(
      () =>
        useLikeOptimistic({
          itemId: mockItemId,
          initialLikesCount: mockInitialLikesCount,
          queryKeyPrefix: mockQueryKeyPrefix,
          checkLikeStatusFn: mockCheckLikeStatusFn,
          toggleLikeFn: mockToggleLikeFn
        }),
      {
        wrapper: createWrapper()
      }
    )

    // Wait for the initial query to complete
    await waitFor(() => expect(result.current.isLikeStatusLoading).toBe(false))

    // Verify initial state
    expect(result.current.isLiked).toBe(false)
    expect(result.current.optimisticLikesCount).toBe(mockInitialLikesCount)

    // Trigger the like mutation
    act(() => {
      result.current.likeMutation.mutate(mockItemId)
    })

    // Wait for the mutation to complete
    await waitFor(() =>
      expect(result.current.likeMutation.isSuccess).toBe(true)
    )

    // Verify that setQueryData was called with the optimistic update
    expect(setQueryDataSpy).toHaveBeenCalledWith(
      [mockQueryKeyPrefix, mockItemId],
      true
    )

    // Verify the toggleLikeFn was called with the correct itemId
    expect(mockToggleLikeFn).toHaveBeenCalledWith(mockItemId)
    expect(mockToggleLikeFn).toHaveBeenCalledTimes(1)

    // After mutation completes, the optimistic update should remain
    expect(result.current.optimisticLikesCount).toBe(mockInitialLikesCount + 1)
  })

  it('should handle successful like toggle (from liked to not liked)', async () => {
    // Mock the check like status function to return true (already liked)
    mockCheckLikeStatusFn.mockResolvedValue(true)

    // Mock the toggle like function to resolve successfully
    mockToggleLikeFn.mockResolvedValue({ success: true })

    // Create a spy on queryClient methods to verify optimistic updates
    const setQueryDataSpy = vi.spyOn(queryClient, 'setQueryData')

    // Render the hook with our wrapper
    const { result } = renderHook(
      () =>
        useLikeOptimistic({
          itemId: mockItemId,
          initialLikesCount: mockInitialLikesCount,
          queryKeyPrefix: mockQueryKeyPrefix,
          checkLikeStatusFn: mockCheckLikeStatusFn,
          toggleLikeFn: mockToggleLikeFn
        }),
      {
        wrapper: createWrapper()
      }
    )

    // Wait for the initial query to complete
    await waitFor(() => expect(result.current.isLikeStatusLoading).toBe(false))

    // Verify initial state
    expect(result.current.isLiked).toBe(true)
    expect(result.current.optimisticLikesCount).toBe(mockInitialLikesCount)

    // Trigger the like mutation
    act(() => {
      result.current.likeMutation.mutate(mockItemId)
    })

    // Wait for the mutation to complete
    await waitFor(() =>
      expect(result.current.likeMutation.isSuccess).toBe(true)
    )

    // Verify that setQueryData was called with the optimistic update
    expect(setQueryDataSpy).toHaveBeenCalledWith(
      [mockQueryKeyPrefix, mockItemId],
      false
    )

    // Verify the toggleLikeFn was called with the correct itemId
    expect(mockToggleLikeFn).toHaveBeenCalledWith(mockItemId)
    expect(mockToggleLikeFn).toHaveBeenCalledTimes(1)

    // After mutation completes, the optimistic update should remain
    expect(result.current.optimisticLikesCount).toBe(mockInitialLikesCount - 1)
  })

  it('should handle failed like toggle and roll back optimistic updates', async () => {
    // Mock the check like status function to return false (not liked)
    mockCheckLikeStatusFn.mockResolvedValue(false)

    // Mock the toggle like function to reject with an error
    const mockError = new Error('Failed to toggle like')
    mockToggleLikeFn.mockRejectedValue(mockError)

    // Create a spy on queryClient methods to verify optimistic updates
    const setQueryDataSpy = vi.spyOn(queryClient, 'setQueryData')

    // Render the hook with our wrapper
    const { result } = renderHook(
      () =>
        useLikeOptimistic({
          itemId: mockItemId,
          initialLikesCount: mockInitialLikesCount,
          queryKeyPrefix: mockQueryKeyPrefix,
          checkLikeStatusFn: mockCheckLikeStatusFn,
          toggleLikeFn: mockToggleLikeFn,
          errorMessage: 'Custom error message'
        }),
      {
        wrapper: createWrapper()
      }
    )

    // Wait for the initial query to complete
    await waitFor(() => expect(result.current.isLikeStatusLoading).toBe(false))

    // Verify initial state
    expect(result.current.isLiked).toBe(false)
    expect(result.current.optimisticLikesCount).toBe(mockInitialLikesCount)

    // Trigger the like mutation
    act(() => {
      result.current.likeMutation.mutate(mockItemId)
    })

    // Wait for the mutation to fail
    await waitFor(() => expect(result.current.likeMutation.isError).toBe(true))

    // Verify the toggleLikeFn was called with the correct itemId
    expect(mockToggleLikeFn).toHaveBeenCalledWith(mockItemId)
    expect(mockToggleLikeFn).toHaveBeenCalledTimes(1)

    // Verify that setQueryData was called twice:
    // 1. First for the optimistic update (setting isLiked to true)
    // 2. Then for the rollback (setting back to false)
    expect(setQueryDataSpy).toHaveBeenCalledTimes(2)

    // First call should be the optimistic update (setting isLiked to true)
    expect(setQueryDataSpy).toHaveBeenNthCalledWith(
      1,
      [mockQueryKeyPrefix, mockItemId],
      true
    )

    // Second call should be the rollback (setting isLiked back to false)
    expect(setQueryDataSpy).toHaveBeenNthCalledWith(
      2,
      [mockQueryKeyPrefix, mockItemId],
      false
    )

    // After mutation fails and rollback, the optimistic count should be back to initial
    expect(result.current.optimisticLikesCount).toBe(mockInitialLikesCount)

    // Verify that the error toast was shown with the custom error message
    expect(toast.error).toHaveBeenCalledWith('Custom error message')
  })

  it('should use default error message when not provided', async () => {
    // Mock the check like status function to return false (not liked)
    mockCheckLikeStatusFn.mockResolvedValue(false)

    // Mock the toggle like function to reject with an error
    const mockError = new Error('Failed to toggle like')
    mockToggleLikeFn.mockRejectedValue(mockError)

    // Render the hook with our wrapper, without providing a custom error message
    const { result } = renderHook(
      () =>
        useLikeOptimistic({
          itemId: mockItemId,
          initialLikesCount: mockInitialLikesCount,
          queryKeyPrefix: mockQueryKeyPrefix,
          checkLikeStatusFn: mockCheckLikeStatusFn,
          toggleLikeFn: mockToggleLikeFn
          // No errorMessage provided, should use default
        }),
      {
        wrapper: createWrapper()
      }
    )

    // Wait for the initial query to complete
    await waitFor(() => expect(result.current.isLikeStatusLoading).toBe(false))

    // Trigger the like mutation
    act(() => {
      result.current.likeMutation.mutate(mockItemId)
    })

    // Wait for the mutation to fail
    await waitFor(() => expect(result.current.likeMutation.isError).toBe(true))

    // Verify that the error toast was shown with the default error message
    expect(toast.error).toHaveBeenCalledWith(
      'Failed to update like status. Please try again.'
    )
  })

  it('should handle zero initial likes count', async () => {
    // Mock the check like status function to return false (not liked)
    mockCheckLikeStatusFn.mockResolvedValue(false)

    // Mock the toggle like function to resolve successfully
    mockToggleLikeFn.mockResolvedValue({ success: true })

    // Create a spy on queryClient methods to verify optimistic updates
    const setQueryDataSpy = vi.spyOn(queryClient, 'setQueryData')

    // Render the hook with our wrapper, with initialLikesCount = 0
    const { result } = renderHook(
      () =>
        useLikeOptimistic({
          itemId: mockItemId,
          initialLikesCount: 0, // Zero initial likes
          queryKeyPrefix: mockQueryKeyPrefix,
          checkLikeStatusFn: mockCheckLikeStatusFn,
          toggleLikeFn: mockToggleLikeFn
        }),
      {
        wrapper: createWrapper()
      }
    )

    // Wait for the initial query to complete
    await waitFor(() => expect(result.current.isLikeStatusLoading).toBe(false))

    // Verify initial state
    expect(result.current.optimisticLikesCount).toBe(0)

    // Trigger the like mutation
    act(() => {
      result.current.likeMutation.mutate(mockItemId)
    })

    // Wait for the mutation to complete
    await waitFor(() =>
      expect(result.current.likeMutation.isSuccess).toBe(true)
    )

    // Verify that setQueryData was called with the optimistic update
    expect(setQueryDataSpy).toHaveBeenCalledWith(
      [mockQueryKeyPrefix, mockItemId],
      true
    )

    // After successful mutation, the optimistic count should be 1
    expect(result.current.optimisticLikesCount).toBe(1)
  })

  it('should use the default initialLikesCount when not provided', async () => {
    // Mock the check like status function to return false (not liked)
    mockCheckLikeStatusFn.mockResolvedValue(false)

    // Render the hook with our wrapper, without providing initialLikesCount
    const { result } = renderHook(
      () =>
        useLikeOptimistic({
          itemId: mockItemId,
          // No initialLikesCount provided, should use default (0)
          queryKeyPrefix: mockQueryKeyPrefix,
          checkLikeStatusFn: mockCheckLikeStatusFn,
          toggleLikeFn: mockToggleLikeFn
        }),
      {
        wrapper: createWrapper()
      }
    )

    // Verify initial state
    expect(result.current.optimisticLikesCount).toBe(0)
  })

  it('should invalidate queries after mutation settles', async () => {
    // Mock the check like status function to return false (not liked)
    mockCheckLikeStatusFn.mockResolvedValue(false)

    // Mock the toggle like function to resolve successfully
    mockToggleLikeFn.mockResolvedValue({ success: true })

    // Create a spy on queryClient.invalidateQueries
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries')

    // Render the hook with our wrapper
    const { result } = renderHook(
      () =>
        useLikeOptimistic({
          itemId: mockItemId,
          initialLikesCount: mockInitialLikesCount,
          queryKeyPrefix: mockQueryKeyPrefix,
          checkLikeStatusFn: mockCheckLikeStatusFn,
          toggleLikeFn: mockToggleLikeFn
        }),
      {
        wrapper: createWrapper()
      }
    )

    // Wait for the initial query to complete
    await waitFor(() => expect(result.current.isLikeStatusLoading).toBe(false))

    // Trigger the like mutation
    act(() => {
      result.current.likeMutation.mutate(mockItemId)
    })

    // Wait for the mutation to complete
    await waitFor(() =>
      expect(result.current.likeMutation.isSuccess).toBe(true)
    )

    // Verify that invalidateQueries was called with the correct query key
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: [mockQueryKeyPrefix, mockItemId]
    })
  })
})
