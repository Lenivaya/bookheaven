import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useBookshelfOptimistic } from './useBookshelfOptimistic'
import { toast } from 'sonner'
import type { DefaultShelves } from '@/lib/constants'

// Define shelf names as constants to use in tests
const WANT_TO_READ = 'Want to Read'
const CURRENTLY_READING = 'Currently Reading'
const READ = 'Read'

// Mock the required modules
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}))

vi.mock('@/app/actions/bookShelves.actions', () => ({
  getUserShelvesWithItems: vi.fn(),
  upsertShelfItemWithShelfName: vi.fn(),
  deleteShelfItem: vi.fn()
}))

import {
  getUserShelvesWithItems,
  upsertShelfItemWithShelfName,
  deleteShelfItem
} from '@/app/actions/bookShelves.actions'

// Mock the DefaultShelves type import
vi.mock('@/lib/constants', () => ({
  // This ensures the type is available but we use our string constants
}))

describe('useBookshelfOptimistic', () => {
  let queryClient: QueryClient
  const mockEditionId = 'edition-123'
  const mockBookTitle = 'Test Book Title'

  // Create a properly typed shelf item
  const createShelfItem = (editionId: string, shelfId: string) => ({
    editionId,
    shelfId,
    updated_at: null as Date | null,
    created_at: new Date(),
    deleted_at: null as Date | null,
    notes: null as string | null
  })

  // Mock shelves data with proper structure
  const mockShelves = [
    {
      id: 'shelf-1',
      name: WANT_TO_READ,
      items: []
    },
    {
      id: 'shelf-2',
      name: CURRENTLY_READING,
      items: []
    },
    {
      id: 'shelf-3',
      name: READ,
      items: [createShelfItem('edition-456', 'shelf-3')]
    }
  ]

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

    // Default mock implementation
    vi.mocked(getUserShelvesWithItems).mockResolvedValue([...mockShelves])
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

  it('should initialize with the correct values when book is not on any shelf', async () => {
    // Render the hook with our wrapper
    const { result } = renderHook(
      () =>
        useBookshelfOptimistic({
          editionId: mockEditionId,
          bookTitle: mockBookTitle,
          systemShelves: [
            WANT_TO_READ,
            CURRENTLY_READING,
            READ
          ] as DefaultShelves[]
        }),
      {
        wrapper: createWrapper()
      }
    )

    // Initially, isShelvesLoading should be true
    expect(result.current.isShelvesLoading).toBe(true)

    // Wait for the query to complete
    await waitFor(() => expect(result.current.isShelvesLoading).toBe(false))

    // After loading, the book should not be on any shelf
    expect(result.current.isBookmarked).toBe(false)
    expect(result.current.currentShelf).toBeUndefined()
    expect(result.current.shelfId).toBeNull()

    // Verify the getUserShelvesWithItems was called
    expect(getUserShelvesWithItems).toHaveBeenCalledTimes(1)
  })

  it('should initialize with the correct values when book is on a shelf', async () => {
    // Mock shelves with the book on a shelf
    const shelvesWithBook = [
      ...mockShelves.slice(0, 2),
      {
        ...mockShelves[2],
        items: [
          ...mockShelves[2].items,
          createShelfItem(mockEditionId, 'shelf-3')
        ]
      }
    ]

    vi.mocked(getUserShelvesWithItems).mockResolvedValue(shelvesWithBook)

    // Render the hook with our wrapper
    const { result } = renderHook(
      () =>
        useBookshelfOptimistic({
          editionId: mockEditionId,
          bookTitle: mockBookTitle
        }),
      {
        wrapper: createWrapper()
      }
    )

    // Wait for the query to complete
    await waitFor(() => expect(result.current.isShelvesLoading).toBe(false))

    // After loading, the book should be on the READ shelf
    expect(result.current.isBookmarked).toBe(true)
    expect(result.current.currentShelf).toBe(READ)
    expect(result.current.shelfId).toBe('shelf-3')
  })

  it('should handle adding a book to a shelf', async () => {
    // Mock the upsert function to resolve successfully
    const mockResponse = [createShelfItem(mockEditionId, 'shelf-1')]
    vi.mocked(upsertShelfItemWithShelfName).mockResolvedValue(mockResponse)

    // Create a spy on queryClient methods to verify optimistic updates
    const setQueryDataSpy = vi.spyOn(queryClient, 'setQueryData')

    // Render the hook with our wrapper
    const { result } = renderHook(
      () =>
        useBookshelfOptimistic({
          editionId: mockEditionId,
          bookTitle: mockBookTitle
        }),
      {
        wrapper: createWrapper()
      }
    )

    // Wait for the query to complete
    await waitFor(() => expect(result.current.isShelvesLoading).toBe(false))

    // Verify initial state
    expect(result.current.isBookmarked).toBe(false)

    // Add the book to the WANT_TO_READ shelf
    act(() => {
      result.current.handleShelfSelect(WANT_TO_READ as DefaultShelves)
    })

    // Wait for the mutation to complete
    await waitFor(() =>
      expect(result.current.addToShelfMutation.isSuccess).toBe(true)
    )

    // Verify the upsertShelfItemWithShelfName was called with the correct parameters
    expect(upsertShelfItemWithShelfName).toHaveBeenCalledWith(
      { editionId: mockEditionId },
      WANT_TO_READ
    )

    // Verify that setQueryData was called for optimistic update
    expect(setQueryDataSpy).toHaveBeenCalled()

    // Verify that the success toast was shown
    expect(toast.success).toHaveBeenCalledWith(
      `Added "${mockBookTitle}" to ${WANT_TO_READ}`
    )
  })

  it('should handle removing a book from a shelf', async () => {
    // Mock shelves with the book on a shelf
    const shelvesWithBook = [
      ...mockShelves.slice(0, 2),
      {
        ...mockShelves[2],
        items: [
          ...mockShelves[2].items,
          createShelfItem(mockEditionId, 'shelf-3')
        ]
      }
    ]

    vi.mocked(getUserShelvesWithItems).mockResolvedValue(shelvesWithBook)
    vi.mocked(deleteShelfItem).mockResolvedValue(true)

    // Create a spy on queryClient methods to verify optimistic updates
    const setQueryDataSpy = vi.spyOn(queryClient, 'setQueryData')

    // Render the hook with our wrapper
    const { result } = renderHook(
      () =>
        useBookshelfOptimistic({
          editionId: mockEditionId,
          bookTitle: mockBookTitle
        }),
      {
        wrapper: createWrapper()
      }
    )

    // Wait for the query to complete
    await waitFor(() => expect(result.current.isShelvesLoading).toBe(false))

    // Verify initial state
    expect(result.current.isBookmarked).toBe(true)
    expect(result.current.currentShelf).toBe(READ)

    // Remove the book from the READ shelf (by selecting the same shelf)
    act(() => {
      result.current.handleShelfSelect(READ as DefaultShelves)
    })

    // Wait for the mutation to complete
    await waitFor(() =>
      expect(result.current.removeFromShelfMutation.isSuccess).toBe(true)
    )

    // Verify the deleteShelfItem was called with the correct parameters
    expect(deleteShelfItem).toHaveBeenCalledWith('shelf-3', mockEditionId)

    // Verify that setQueryData was called for optimistic update
    expect(setQueryDataSpy).toHaveBeenCalled()

    // Verify that the success toast was shown
    expect(toast.success).toHaveBeenCalledWith(
      `Removed "${mockBookTitle}" from ${READ}`
    )
  })

  it('should handle moving a book between shelves', async () => {
    // Mock shelves with the book on a shelf
    const shelvesWithBook = [
      ...mockShelves.slice(0, 2),
      {
        ...mockShelves[2],
        items: [
          ...mockShelves[2].items,
          createShelfItem(mockEditionId, 'shelf-3')
        ]
      }
    ]

    vi.mocked(getUserShelvesWithItems).mockResolvedValue(shelvesWithBook)
    vi.mocked(deleteShelfItem).mockResolvedValue(true)

    const mockResponse = [createShelfItem(mockEditionId, 'shelf-1')]
    vi.mocked(upsertShelfItemWithShelfName).mockResolvedValue(mockResponse)

    // Create a spy on queryClient methods to verify optimistic updates
    const setQueryDataSpy = vi.spyOn(queryClient, 'setQueryData')

    // Render the hook with our wrapper
    const { result } = renderHook(
      () =>
        useBookshelfOptimistic({
          editionId: mockEditionId,
          bookTitle: mockBookTitle
        }),
      {
        wrapper: createWrapper()
      }
    )

    // Wait for the query to complete
    await waitFor(() => expect(result.current.isShelvesLoading).toBe(false))

    // Verify initial state
    expect(result.current.isBookmarked).toBe(true)
    expect(result.current.currentShelf).toBe(READ)

    // Move the book from READ to WANT_TO_READ shelf
    act(() => {
      result.current.handleShelfSelect(WANT_TO_READ as DefaultShelves)
    })

    // Wait for the operations to complete
    await waitFor(() => {
      expect(deleteShelfItem).toHaveBeenCalled()
      expect(upsertShelfItemWithShelfName).toHaveBeenCalled()
    })

    // Verify the operations were called with the correct parameters
    expect(deleteShelfItem).toHaveBeenCalledWith('shelf-3', mockEditionId)
    expect(upsertShelfItemWithShelfName).toHaveBeenCalledWith(
      { editionId: mockEditionId },
      WANT_TO_READ
    )

    // Verify that setQueryData was called for optimistic update
    expect(setQueryDataSpy).toHaveBeenCalled()

    // Verify that the success toast was shown
    expect(toast.success).toHaveBeenCalledWith(
      `Moved "${mockBookTitle}" from ${READ} to ${WANT_TO_READ}`
    )
  })

  it('should handle error when adding a book to a shelf fails', async () => {
    // Mock the upsert function to reject with an error
    const mockError = new Error('Failed to add book to shelf')
    vi.mocked(upsertShelfItemWithShelfName).mockRejectedValue(mockError)

    // Create a spy on queryClient methods to verify optimistic updates and rollback
    const setQueryDataSpy = vi.spyOn(queryClient, 'setQueryData')

    // Render the hook with our wrapper
    const { result } = renderHook(
      () =>
        useBookshelfOptimistic({
          editionId: mockEditionId,
          bookTitle: mockBookTitle
        }),
      {
        wrapper: createWrapper()
      }
    )

    // Wait for the query to complete
    await waitFor(() => expect(result.current.isShelvesLoading).toBe(false))

    // Add the book to the WANT_TO_READ shelf
    act(() => {
      result.current.handleShelfSelect(WANT_TO_READ as DefaultShelves)
    })

    // Wait for the mutation to fail
    await waitFor(() =>
      expect(result.current.addToShelfMutation.isError).toBe(true)
    )

    // Verify the upsertShelfItemWithShelfName was called
    expect(upsertShelfItemWithShelfName).toHaveBeenCalled()

    // Verify that the error toast was shown
    expect(toast.error).toHaveBeenCalledWith(
      `Failed to add "${mockBookTitle}" to ${WANT_TO_READ}`
    )
  })

  it('should handle error when removing a book from a shelf fails', async () => {
    // Mock shelves with the book on a shelf
    const shelvesWithBook = [
      ...mockShelves.slice(0, 2),
      {
        ...mockShelves[2],
        items: [
          ...mockShelves[2].items,
          createShelfItem(mockEditionId, 'shelf-3')
        ]
      }
    ]

    vi.mocked(getUserShelvesWithItems).mockResolvedValue(shelvesWithBook)

    // Mock the delete function to reject with an error
    const mockError = new Error('Failed to remove book from shelf')
    vi.mocked(deleteShelfItem).mockRejectedValue(mockError)

    // Render the hook with our wrapper
    const { result } = renderHook(
      () =>
        useBookshelfOptimistic({
          editionId: mockEditionId,
          bookTitle: mockBookTitle
        }),
      {
        wrapper: createWrapper()
      }
    )

    // Wait for the query to complete
    await waitFor(() => expect(result.current.isShelvesLoading).toBe(false))

    // Remove the book from the READ shelf
    act(() => {
      result.current.handleShelfSelect(READ as DefaultShelves)
    })

    // Wait for the mutation to fail
    await waitFor(() =>
      expect(result.current.removeFromShelfMutation.isError).toBe(true)
    )

    // Verify the deleteShelfItem was called
    expect(deleteShelfItem).toHaveBeenCalled()

    // Verify that the error toast was shown
    expect(toast.error).toHaveBeenCalledWith(
      `Failed to remove "${mockBookTitle}" from ${READ}`
    )
  })

  it('should handle error when moving a book between shelves fails', async () => {
    // Mock shelves with the book on a shelf
    const shelvesWithBook = [
      ...mockShelves.slice(0, 2),
      {
        ...mockShelves[2],
        items: [
          ...mockShelves[2].items,
          createShelfItem(mockEditionId, 'shelf-3')
        ]
      }
    ]

    vi.mocked(getUserShelvesWithItems).mockResolvedValue(shelvesWithBook)

    // Mock the delete function to succeed but upsert to fail
    vi.mocked(deleteShelfItem).mockResolvedValue(true)
    const mockError = new Error('Failed to add book to new shelf')
    vi.mocked(upsertShelfItemWithShelfName).mockRejectedValue(mockError)

    // Create a spy on queryClient methods to verify optimistic updates and rollback
    const setQueryDataSpy = vi.spyOn(queryClient, 'setQueryData')

    // Render the hook with our wrapper
    const { result } = renderHook(
      () =>
        useBookshelfOptimistic({
          editionId: mockEditionId,
          bookTitle: mockBookTitle
        }),
      {
        wrapper: createWrapper()
      }
    )

    // Wait for the query to complete
    await waitFor(() => expect(result.current.isShelvesLoading).toBe(false))

    // Move the book from READ to WANT_TO_READ shelf
    act(() => {
      result.current.handleShelfSelect(WANT_TO_READ as DefaultShelves)
    })

    // Wait for the operations to complete
    await waitFor(() => {
      expect(deleteShelfItem).toHaveBeenCalled()
      expect(upsertShelfItemWithShelfName).toHaveBeenCalled()
    })

    // Verify that the error toast was shown
    expect(toast.error).toHaveBeenCalledWith(
      `Failed to move "${mockBookTitle}" to ${WANT_TO_READ}`
    )
  })
})
