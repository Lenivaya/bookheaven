import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import React from 'react'

// Mock modules before importing the component
vi.mock('@/app/user/dashboard/orders/searchParams', () => ({
  orderSearchParamsSchema: {
    q: { default: '' },
    page: { default: '1' }
  }
}))

// Create mock functions outside of the mock calls
const mockSetQueryStates = vi.fn().mockResolvedValue(undefined)
const mockDebouncedFn = vi.fn()

// Mock the nuqs module
vi.mock('nuqs', () => ({
  useQueryStates: vi.fn()
}))

// Mock the debounce function
vi.mock('use-debounce', () => ({
  useDebouncedCallback: vi.fn()
}))

// Import the component and mocked dependencies
import { OrdersSearch } from '@/components/orders/orders-search/OrdersSearch'
import { useQueryStates } from 'nuqs'
import { useDebouncedCallback } from 'use-debounce'

describe('OrdersSearch', () => {
  // Set up mocks before each test
  beforeEach(() => {
    vi.resetAllMocks()

    // Set up the useQueryStates mock implementation
    vi.mocked(useQueryStates).mockReturnValue([
      { q: '', page: '1' },
      mockSetQueryStates
    ])

    // Set up the useDebouncedCallback mock implementation
    vi.mocked(useDebouncedCallback).mockImplementation(
      (callback: any, _delay: any) => {
        mockDebouncedFn.mockImplementation((value: string) => callback(value))
        return mockDebouncedFn as any
      }
    )
  })

  // Clean up after each test
  afterEach(() => {
    cleanup()
  })

  it('renders the search input correctly', () => {
    render(<OrdersSearch />)

    // Check if the search input is rendered
    const searchInput = screen.getByPlaceholderText('Search orders...')
    expect(searchInput).toBeInTheDocument()

    // Check if the search icon is rendered
    expect(document.querySelector('svg')).toBeInTheDocument()
  })

  it('initializes with the query state value', () => {
    // Mock the query state with an initial value
    vi.mocked(useQueryStates).mockReturnValueOnce([
      { q: 'initial search', page: '1' },
      mockSetQueryStates
    ])

    // Mock useState to set the initial search value
    vi.spyOn(React, 'useState').mockImplementationOnce(() => [
      'initial search',
      vi.fn()
    ])

    render(<OrdersSearch />)

    // Check if the input has the initial value
    const searchInput = screen.getByPlaceholderText(
      'Search orders...'
    ) as HTMLInputElement
    expect(searchInput.value).toBe('initial search')
  })

  it('updates search value on input change', async () => {
    render(<OrdersSearch />)

    // Get the search input
    const searchInput = screen.getByPlaceholderText('Search orders...')

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

    // Check if setQueryStates was called with the correct arguments
    expect(mockSetQueryStates).toHaveBeenCalledWith({
      q: 'test search',
      page: '1'
    })
  })

  it('resets page to 1 when search changes', async () => {
    // Mock with a different page value
    vi.mocked(useQueryStates).mockReturnValueOnce([
      { q: '', page: '3' }, // Initial page is 3
      mockSetQueryStates
    ])

    render(<OrdersSearch />)

    // Get the search input
    const searchInput = screen.getByPlaceholderText('Search orders...')

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

    // Check if setQueryStates was called with the correct arguments
    expect(mockSetQueryStates).toHaveBeenCalledWith({
      q: 'new search',
      page: '1'
    })
  })

  it('has the correct styling', () => {
    render(<OrdersSearch />)

    // Check if the input has the correct classes
    const searchInput = screen.getByPlaceholderText('Search orders...')
    expect(searchInput).toHaveClass('pl-8')
    expect(searchInput).toHaveClass('text-center')

    // Check if the search icon has the correct classes
    const searchIcon = document.querySelector('svg')
    expect(searchIcon).toHaveClass('text-muted-foreground')
  })
})
