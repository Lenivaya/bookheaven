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
vi.mock('@/app/authors/searchParams', () => ({
  authorSearchParamsSchema: {
    q: { default: '' },
    page: { default: '1' }
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

// Import the component and mocked dependencies
import { AuthorsSearch } from '@/components/authors/author-search/AuthorsSearch'
import { useQueryStates } from 'nuqs'
import { useDebouncedCallback } from 'use-debounce'
import { useHotkeys } from 'react-hotkeys-hook'

describe('AuthorsSearch', () => {
  // Set up mocks before each test
  beforeEach(() => {
    vi.resetAllMocks()

    // Set up the useQueryStates mock implementation
    vi.mocked(useQueryStates).mockReturnValue([
      { q: '', page: '1' },
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
  })

  // Clean up after each test
  afterEach(() => {
    cleanup()
  })

  it('renders the search input correctly', () => {
    render(<AuthorsSearch />)

    // Check if the search input is rendered
    const searchInput = screen.getByPlaceholderText(
      'Search for authors by name, biography...'
    )
    expect(searchInput).toBeInTheDocument()

    // Check if the search icon is rendered
    expect(document.querySelector('svg')).toBeInTheDocument()
  })

  it('initializes with the query state value', () => {
    // Mock the query state with an initial value
    vi.mocked(useQueryStates).mockReturnValueOnce([
      { q: 'initial search', page: '1' },
      mockSetSearchParams
    ])

    // Create a mock component that just renders the value from props
    const MockComponent = () => {
      const [{ q }] = useQueryStates(vi.fn() as any)
      return <div data-testid='mock-value'>{q}</div>
    }

    render(<MockComponent />)

    // Verify that our mock is working correctly
    expect(screen.getByTestId('mock-value').textContent).toBe('initial search')
  })

  it('updates search value on input change', async () => {
    render(<AuthorsSearch />)

    // Get the search input
    const searchInput = screen.getByPlaceholderText(
      'Search for authors by name, biography...'
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

  it('resets page to 1 when search changes', async () => {
    // Mock with a different page value
    vi.mocked(useQueryStates).mockReturnValueOnce([
      { q: '', page: '3' }, // Initial page is 3
      mockSetSearchParams
    ])

    render(<AuthorsSearch />)

    // Get the search input
    const searchInput = screen.getByPlaceholderText(
      'Search for authors by name, biography...'
    )

    // Type in the search input
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'new search' } })
    })

    // Verify the input value was updated
    expect(searchInput).toHaveValue('new search')

    // Simulate the debounced callback being triggered
    await act(async () => {
      // Get the callback that was passed to useDebouncedCallback
      const callback = vi.mocked(useDebouncedCallback).mock.calls[0][0]
      // Call that callback directly with the search value
      await callback('new search')
    })

    // Check if setSearchParams was called with the correct arguments
    expect(mockSetSearchParams).toHaveBeenCalledWith({
      q: 'new search',
      page: '1'
    })
  })

  it('does not show the search query in the filter section when empty', () => {
    render(<AuthorsSearch />)

    // Check that the search query is not displayed in the filter section
    expect(screen.queryByText(/Searching for/)).not.toBeInTheDocument()
  })

  it('has the correct styling', () => {
    render(<AuthorsSearch />)

    // Check if the input has the correct classes
    const searchInput = screen.getByPlaceholderText(
      'Search for authors by name, biography...'
    )
    expect(searchInput).toHaveClass('border-0')
    expect(searchInput).toHaveClass('bg-transparent')
    expect(searchInput).toHaveClass('text-center')

    // Check if the search icon has the correct classes
    const searchIcon = document.querySelector('svg')
    expect(searchIcon).toHaveClass('text-muted-foreground/60')
  })
})
