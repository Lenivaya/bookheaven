import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { ReviewsPagination } from '@/components/reviews/review-pagination/ReviewsPagination'

// Mock the nuqs module
vi.mock('nuqs', () => ({
  useQueryStates: vi.fn()
}))

// Mock the Pagination component
vi.mock('@/components/generic/pagination/Pagination', () => ({
  Pagination: vi.fn(({ meta, onPageChange }) => (
    <div data-testid='pagination'>
      <button
        data-testid='page-button'
        onClick={() => onPageChange(meta.page + 1)}
      >
        Next Page
      </button>
      <span data-testid='current-page'>{meta.page}</span>
      <span data-testid='page-count'>{meta.pageCount}</span>
      <span data-testid='total-count'>{meta.total}</span>
      <span data-testid='page-size'>{meta.limit}</span>
    </div>
  ))
}))

// Import the mocked functions
import { useQueryStates } from 'nuqs'

// Clean up after each test
afterEach(() => {
  cleanup()
  vi.resetAllMocks()
})

describe('ReviewsPagination', () => {
  it('renders the pagination component with correct props', () => {
    // Mock the useQueryStates hook
    const mockSetSearchParams = vi.fn()
    vi.mocked(useQueryStates).mockReturnValue([
      { q: '', page: '1' },
      mockSetSearchParams
    ])

    // Define test props
    const props = {
      currentPage: 2,
      pageCount: 5,
      totalCount: 50,
      pageSize: 10
    }

    render(<ReviewsPagination {...props} />)

    // Check if the pagination component is rendered with correct props
    expect(screen.getByTestId('pagination')).toBeInTheDocument()
    expect(screen.getByTestId('current-page').textContent).toBe('2')
    expect(screen.getByTestId('page-count').textContent).toBe('5')
    expect(screen.getByTestId('total-count').textContent).toBe('50')
    expect(screen.getByTestId('page-size').textContent).toBe('10')
  })

  it('calls setSearchParams when page changes', () => {
    // Mock the useQueryStates hook
    const mockSetSearchParams = vi.fn()
    vi.mocked(useQueryStates).mockReturnValue([
      { q: '', page: '1' },
      mockSetSearchParams
    ])

    // Define test props
    const props = {
      currentPage: 2,
      pageCount: 5,
      totalCount: 50,
      pageSize: 10
    }

    render(<ReviewsPagination {...props} />)

    // Click the next page button
    fireEvent.click(screen.getByTestId('page-button'))

    // Check if setSearchParams was called with the correct page
    expect(mockSetSearchParams).toHaveBeenCalledWith({ page: '3' })
  })
})
