import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
  act
} from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import React from 'react'

// Mock modules before importing the component
// These mocks are hoisted to the top of the file by Vitest
vi.mock('@/app/books/searchParams', () => ({
  bookSearchParamsSchema: {
    q: { default: '' },
    page: { default: '1' },
    tags: { default: [] },
    authors: { default: [] },
    books: { default: [] }
  }
}))

// Create mock functions outside of the mock calls
const mockSetSearchParams = vi.fn().mockResolvedValue(undefined)
const mockDebouncedFn = vi.fn()

// Mock the nuqs module
vi.mock('nuqs', () => ({
  useQueryStates: vi.fn()
}))

// Mock the debounce function
vi.mock('use-debounce', () => ({
  useDebouncedCallback: vi.fn()
}))

// Mock the react-hotkeys-hook
vi.mock('react-hotkeys-hook', () => ({
  useHotkeys: vi.fn()
}))

// Mock the tanstack/react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn().mockReturnValue({ data: null })
}))

// Mock the actions
vi.mock('@/app/actions/tags.actions', () => ({
  getTag: vi.fn()
}))

vi.mock('@/app/actions/authors.actions', () => ({
  getAuthor: vi.fn()
}))

vi.mock('@/app/actions/books.actions', () => ({
  getBookWorkById: vi.fn()
}))

// Mock the Suspense component
vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    Suspense: ({ children }: { children: React.ReactNode }) => <>{children}</>
  }
})

// Import the component and mocked dependencies
import { BooksSearch } from '@/components/books/book-search/BooksSearch'
import { useQueryStates } from 'nuqs'
import { useDebouncedCallback } from 'use-debounce'
import { useHotkeys } from 'react-hotkeys-hook'
import { useQuery } from '@tanstack/react-query'

describe('BooksSearch', () => {
  // Set up mocks before each test
  beforeEach(() => {
    vi.resetAllMocks()

    // Set up the useQueryStates mock implementation
    vi.mocked(useQueryStates).mockReturnValue([
      { q: '', page: '1', tags: [], authors: [], books: [] },
      mockSetSearchParams
    ])

    // Set up the useDebouncedCallback mock implementation
    vi.mocked(useDebouncedCallback).mockImplementation(
      (callback: any, _delay: any) => {
        mockDebouncedFn.mockImplementation((value: string) => callback(value))
        return mockDebouncedFn as any
      }
    )

    // Set up the useHotkeys mock implementation
    vi.mocked(useHotkeys).mockImplementation((_keys: any, callback: any) => {
      // Do nothing with the hotkey callback
      return undefined as any
    })

    // Set up the useQuery mock implementation
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      isLoading: false,
      error: null
    } as any)
  })

  // Clean up after each test
  afterEach(() => {
    cleanup()
  })

  it('renders the search input correctly', () => {
    render(<BooksSearch />)

    // Check if the search input is rendered
    const searchInput = screen.getByPlaceholderText(
      'Search for a book on BookHeaven...'
    )
    expect(searchInput).toBeInTheDocument()

    // Check if the search icon is rendered
    expect(document.querySelector('svg')).toBeInTheDocument()
  })

  it('updates search value on input change', async () => {
    render(<BooksSearch />)

    // Get the search input
    const searchInput = screen.getByPlaceholderText(
      'Search for a book on BookHeaven...'
    )

    // Type in the search input
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'test search' } })
    })

    // Verify the input value was updated
    expect(searchInput).toHaveValue('test search')

    // Simulate the debounced callback being triggered
    await act(async () => {
      // Get the callback that was passed to useDebouncedCallback
      const callback = vi.mocked(useDebouncedCallback).mock.calls[0][0]
      // Call that callback directly with the search value
      await callback('test search')
    })

    // Check if setSearchParams was called with the correct arguments
    expect(mockSetSearchParams).toHaveBeenCalledWith({
      q: 'test search',
      page: '1'
    })
  })

  it('shows tag filters when tags are present', () => {
    // Mock the query state with tags
    vi.mocked(useQueryStates).mockReturnValueOnce([
      { q: '', page: '1', tags: ['tag1', 'tag2'], authors: [], books: [] },
      mockSetSearchParams
    ])

    render(<BooksSearch />)

    // Check if the tag count is displayed
    expect(screen.getByText('2 tags')).toBeInTheDocument()
  })

  it('shows author filters when authors are present', () => {
    // Mock the query state with authors
    vi.mocked(useQueryStates).mockReturnValueOnce([
      { q: '', page: '1', tags: [], authors: ['author1'], books: [] },
      mockSetSearchParams
    ])

    render(<BooksSearch />)

    // Check if the author count is displayed
    expect(screen.getByText('1 author')).toBeInTheDocument()
  })

  it('shows book filters when books are present', () => {
    // Mock the query state with books
    vi.mocked(useQueryStates).mockReturnValueOnce([
      {
        q: '',
        page: '1',
        tags: [],
        authors: [],
        books: ['book1', 'book2', 'book3']
      },
      mockSetSearchParams
    ])

    render(<BooksSearch />)

    // Check if the book count is displayed
    expect(screen.getByText('3 books')).toBeInTheDocument()
  })

  it('removes a tag when clicked', async () => {
    // Mock the query state with tags
    vi.mocked(useQueryStates).mockReturnValueOnce([
      { q: '', page: '1', tags: ['tag1', 'tag2'], authors: [], books: [] },
      mockSetSearchParams
    ])

    // Mock the tag data
    vi.mocked(useQuery).mockReturnValueOnce({
      data: { id: 'tag1', name: 'Fantasy' },
      isLoading: false,
      error: null
    } as any)

    render(<BooksSearch />)

    // Find and click the tag badge
    const tagBadge = screen.getByText('Fantasy')
    await act(async () => {
      fireEvent.click(tagBadge)
    })

    // Check if setSearchParams was called to remove the tag
    expect(mockSetSearchParams).toHaveBeenCalled()
    // The function should be called with a function that updates the previous state
    const updateFn = mockSetSearchParams.mock.calls[0][0]
    const result = updateFn({
      q: '',
      page: '1',
      tags: ['tag1', 'tag2'],
      authors: [],
      books: []
    })
    expect(result).toEqual({
      q: '',
      page: '1',
      tags: ['tag2'],
      authors: [],
      books: []
    })
  })

  it('removes an author when clicked', async () => {
    // Mock the query state with authors
    vi.mocked(useQueryStates).mockReturnValueOnce([
      {
        q: '',
        page: '1',
        tags: [],
        authors: ['author1', 'author2'],
        books: []
      },
      mockSetSearchParams
    ])

    // Mock the author data
    vi.mocked(useQuery).mockReturnValueOnce({
      data: { id: 'author1', name: 'J.K. Rowling' },
      isLoading: false,
      error: null
    } as any)

    render(<BooksSearch />)

    // Find and click the author badge
    const authorBadge = screen.getByText('J.K. Rowling')
    await act(async () => {
      fireEvent.click(authorBadge)
    })

    // Check if setSearchParams was called to remove the author
    expect(mockSetSearchParams).toHaveBeenCalled()
    // The function should be called with a function that updates the previous state
    const updateFn = mockSetSearchParams.mock.calls[0][0]
    const result = updateFn({
      q: '',
      page: '1',
      tags: [],
      authors: ['author1', 'author2'],
      books: []
    })
    expect(result).toEqual({
      q: '',
      page: '1',
      tags: [],
      authors: ['author2'],
      books: []
    })
  })

  it('removes a book when clicked', async () => {
    // Mock the query state with books
    vi.mocked(useQueryStates).mockReturnValueOnce([
      { q: '', page: '1', tags: [], authors: [], books: ['book1', 'book2'] },
      mockSetSearchParams
    ])

    // Mock the book data
    vi.mocked(useQuery).mockReturnValueOnce({
      data: { id: 'book1', title: 'Harry Potter' },
      isLoading: false,
      error: null
    } as any)

    render(<BooksSearch />)

    // Find and click the book badge
    const bookBadge = screen.getByText('Harry Potter')
    await act(async () => {
      fireEvent.click(bookBadge)
    })

    // Check if setSearchParams was called to remove the book
    expect(mockSetSearchParams).toHaveBeenCalled()
    // The function should be called with a function that updates the previous state
    const updateFn = mockSetSearchParams.mock.calls[0][0]
    const result = updateFn({
      q: '',
      page: '1',
      tags: [],
      authors: [],
      books: ['book1', 'book2']
    })
    expect(result).toEqual({
      q: '',
      page: '1',
      tags: [],
      authors: [],
      books: ['book2']
    })
  })

  it('shows keyboard shortcut hint when search is empty', () => {
    render(<BooksSearch />)

    // Check if the keyboard shortcut hint is displayed
    expect(screen.getByText('K')).toBeInTheDocument()
  })

  it('does not focus the input when isAutoFocusable is false', () => {
    // Create a mock ref
    const mockFocus = vi.fn()
    const mockRef = { current: { focus: mockFocus } }

    // Mock the useRef hook
    vi.spyOn(React, 'useRef').mockReturnValue(mockRef)

    render(<BooksSearch isAutoFocusable={false} />)

    // Check if the input was not focused
    expect(mockFocus).not.toHaveBeenCalled()
  })
})
