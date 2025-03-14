import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  render,
  screen,
  cleanup,
  within,
  fireEvent
} from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { BookActions } from '@/components/books/book-card/BookActions'

// Mock dependencies before importing them
// Create mock functions that will be used in the mocks
const mockHandleShelfSelect = vi.fn()
const mockRatingMutate = vi.fn()
const mockAddToShelfMutate = vi.fn()
const mockRemoveFromShelfMutate = vi.fn()

// Mock the hooks and components used in BookActions
vi.mock('@/hooks/useBookshelfOptimistic', () => {
  return {
    useBookshelfOptimistic: vi.fn().mockImplementation(() => ({
      userShelves: [],
      isShelvesLoading: false,
      isShelvesError: false,
      currentShelf: null,
      isBookmarked: false,
      shelfId: null,
      addToShelfMutation: {
        isPending: false,
        mutate: mockAddToShelfMutate,
        isSuccess: false,
        isError: false,
        error: null,
        data: null,
        variables: undefined,
        reset: vi.fn()
      },
      removeFromShelfMutation: {
        isPending: false,
        mutate: mockRemoveFromShelfMutate,
        isSuccess: false,
        isError: false,
        error: null,
        data: null,
        variables: undefined,
        reset: vi.fn()
      },
      handleShelfSelect: mockHandleShelfSelect,
      isPending: false
    }))
  }
})

vi.mock('@tanstack/react-query', () => {
  return {
    useQuery: vi.fn().mockImplementation(() => ({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
      status: 'success',
      isPending: false,
      isSuccess: true,
      refetch: vi.fn(),
      promise: Promise.resolve()
    })),
    useMutation: vi.fn().mockImplementation(() => ({
      mutate: mockRatingMutate,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: null,
      variables: undefined,
      reset: vi.fn(),
      mutateAsync: vi.fn(),
      status: 'idle'
    })),
    useQueryClient: vi.fn().mockImplementation(() => ({
      invalidateQueries: vi.fn()
    }))
  }
})

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    className,
    disabled,
    'aria-label': ariaLabel
  }: any) => (
    <button
      data-testid={`book-action-button-${ariaLabel ? ariaLabel.replace(/\s+/g, '-').toLowerCase() : 'no-label'}`}
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}))

vi.mock('@/components/ui/popover', () => ({
  Popover: ({ children, open, onOpenChange }: any) => (
    <div data-testid='popover' data-open={open?.toString()}>
      {typeof onOpenChange === 'function' && (
        <button
          data-testid='toggle-popover'
          onClick={() => onOpenChange(!open)}
        >
          Toggle
        </button>
      )}
      {children}
    </div>
  ),
  PopoverTrigger: ({ children }: any) => (
    <div data-testid='popover-trigger'>{children}</div>
  ),
  PopoverContent: ({ children, className }: any) => (
    <div data-testid='popover-content' className={className}>
      {children}
    </div>
  )
}))

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenuSeparator: ({ className }: any) => (
    <div data-testid='dropdown-separator' className={className} />
  )
}))

vi.mock('lucide-react', () => ({
  Bookmark: () => <div data-testid='bookmark-icon' />,
  BookMarked: () => <div data-testid='bookmarked-icon' />,
  BookOpen: () => <div data-testid='book-open-icon' />,
  BookCheck: () => <div data-testid='book-check-icon' />,
  BookX: () => <div data-testid='book-x-icon' />,
  X: () => <div data-testid='x-icon' />
}))

vi.mock('@/components/books/book-card/BookRating', () => ({
  BookRating: ({
    rating,
    onRatingChange,
    interactive,
    isLoading,
    size
  }: any) => (
    <div
      data-testid='book-rating'
      data-rating={rating}
      data-interactive={interactive?.toString()}
      data-loading={isLoading?.toString()}
      data-size={size}
      onClick={() => onRatingChange && onRatingChange(4)}
    />
  )
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

// Import the mocked hooks
import { useBookshelfOptimistic } from '@/hooks/useBookshelfOptimistic'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

// Clean up after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('BookActions', () => {
  it('renders loading state when shelves are loading', () => {
    // Mock the useBookshelfOptimistic hook to return loading state
    vi.mocked(useBookshelfOptimistic).mockImplementationOnce(() => ({
      userShelves: [],
      isShelvesLoading: true,
      isShelvesError: false,
      currentShelf: null,
      isBookmarked: false,
      shelfId: null,
      addToShelfMutation: {
        isPending: false,
        mutate: mockAddToShelfMutate,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        variables: undefined,
        reset: vi.fn()
      },
      removeFromShelfMutation: {
        isPending: false,
        mutate: mockRemoveFromShelfMutate,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        variables: undefined,
        reset: vi.fn()
      },
      handleShelfSelect: mockHandleShelfSelect,
      isPending: false
    }))

    render(
      <div data-testid='loading-container'>
        <BookActions editionId='edition-1' bookTitle='Test Book' />
      </div>
    )

    const container = screen.getByTestId('loading-container')

    // Find the button - it should have a data-testid that includes the aria-label
    // Since we don't know the exact aria-label, we'll look for any button with a data-testid that starts with 'book-action-button'
    const buttons = container.querySelectorAll(
      '[data-testid^="book-action-button"]'
    )
    expect(buttons.length).toBeGreaterThan(0)

    // Get the first button (the main action button)
    const button = buttons[0] as HTMLButtonElement
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()

    // Check if the bookmark icon is rendered with animate-pulse class
    const icon = within(button).getByTestId('bookmark-icon')
    expect(icon).toBeInTheDocument()
    expect(button.className).toContain('opacity-50')
  })

  it('renders bookmark button when not bookmarked', () => {
    // Mock the useBookshelfOptimistic hook to return not bookmarked state
    vi.mocked(useBookshelfOptimistic).mockImplementationOnce(() => ({
      userShelves: [],
      isShelvesLoading: false,
      isShelvesError: false,
      currentShelf: null,
      isBookmarked: false,
      shelfId: null,
      addToShelfMutation: {
        isPending: false,
        mutate: mockAddToShelfMutate,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        variables: undefined,
        reset: vi.fn()
      },
      removeFromShelfMutation: {
        isPending: false,
        mutate: mockRemoveFromShelfMutate,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        variables: undefined,
        reset: vi.fn()
      },
      handleShelfSelect: mockHandleShelfSelect,
      isPending: false
    }))

    render(
      <div data-testid='not-bookmarked-container'>
        <BookActions editionId='edition-1' bookTitle='Test Book' />
      </div>
    )

    const container = screen.getByTestId('not-bookmarked-container')

    // Find the button - it should have a data-testid that includes the aria-label
    // Since we don't know the exact aria-label, we'll look for any button with a data-testid that starts with 'book-action-button'
    const buttons = container.querySelectorAll(
      '[data-testid^="book-action-button"]'
    )
    expect(buttons.length).toBeGreaterThan(0)

    // Get the first button (the main action button)
    const button = buttons[0] as HTMLButtonElement
    expect(button).toBeInTheDocument()
    expect(button).not.toBeDisabled()

    // Check if the bookmark icon is rendered
    const icon = within(button).getByTestId('bookmark-icon')
    expect(icon).toBeInTheDocument()

    // Check if the button has the opacity-0 class for hover effect
    expect(button.className).toContain('opacity-0')
    expect(button.className).toContain('group-hover:opacity-100')
  })

  it('renders correct icon when book is on a shelf', () => {
    // Mock the useBookshelfOptimistic hook to return bookmarked state with a specific shelf
    vi.mocked(useBookshelfOptimistic).mockImplementationOnce(() => ({
      userShelves: [],
      isShelvesLoading: false,
      isShelvesError: false,
      currentShelf: 'Currently Reading',
      isBookmarked: true,
      shelfId: 'shelf-1',
      addToShelfMutation: {
        isPending: false,
        mutate: mockAddToShelfMutate,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        variables: undefined,
        reset: vi.fn()
      },
      removeFromShelfMutation: {
        isPending: false,
        mutate: mockRemoveFromShelfMutate,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        variables: undefined,
        reset: vi.fn()
      },
      handleShelfSelect: mockHandleShelfSelect,
      isPending: false
    }))

    render(
      <div data-testid='bookmarked-container'>
        <BookActions editionId='edition-1' bookTitle='Test Book' />
      </div>
    )

    const container = screen.getByTestId('bookmarked-container')

    // Find the button - it should have a data-testid that includes the aria-label
    // Since we don't know the exact aria-label, we'll look for any button with a data-testid that starts with 'book-action-button'
    const buttons = container.querySelectorAll(
      '[data-testid^="book-action-button"]'
    )
    expect(buttons.length).toBeGreaterThan(0)

    // Get the first button (the main action button)
    const button = buttons[0] as HTMLButtonElement
    expect(button).toBeInTheDocument()

    // Check if the correct icon is rendered based on the shelf
    const icon = within(button).getByTestId('book-open-icon')
    expect(icon).toBeInTheDocument()

    // Check if the button has the opacity-100 class
    expect(button.className).toContain('opacity-100')
  })

  it('renders popover content with rating component', () => {
    // Mock the useBookshelfOptimistic hook
    vi.mocked(useBookshelfOptimistic).mockImplementationOnce(() => ({
      userShelves: [],
      isShelvesLoading: false,
      isShelvesError: false,
      currentShelf: null,
      isBookmarked: false,
      shelfId: null,
      addToShelfMutation: {
        isPending: false,
        mutate: mockAddToShelfMutate,
        isSuccess: false,
        isError: false,
        error: null,
        data: null,
        variables: undefined,
        reset: vi.fn()
      },
      removeFromShelfMutation: {
        isPending: false,
        mutate: mockRemoveFromShelfMutate,
        isSuccess: false,
        isError: false,
        error: null,
        data: null,
        variables: undefined,
        reset: vi.fn()
      },
      handleShelfSelect: mockHandleShelfSelect,
      isPending: false
    }))

    // Mock the useQuery hook to return user rating and average rating
    vi.mocked(useQuery)
      .mockImplementationOnce(() => ({
        data: { rating: 3 },
        isLoading: false,
        isError: false,
        error: null,
        status: 'success',
        isPending: false,
        isSuccess: true,
        refetch: vi.fn(),
        promise: Promise.resolve()
      }))
      .mockImplementationOnce(() => ({
        data: { averageRating: 4.2, totalRatings: 10 },
        isLoading: false,
        isError: false,
        error: null,
        status: 'success',
        isPending: false,
        isSuccess: true,
        refetch: vi.fn(),
        promise: Promise.resolve()
      }))

    render(
      <div data-testid='popover-container'>
        <BookActions editionId='edition-1' bookTitle='Test Book' />
      </div>
    )

    const container = screen.getByTestId('popover-container')

    // Check if the popover is rendered
    const popover = within(container).getByTestId('popover')
    expect(popover).toBeInTheDocument()

    // Toggle the popover to open it
    const toggleButton = within(container).getByTestId('toggle-popover')
    fireEvent.click(toggleButton)

    // Check if the popover content is rendered
    const popoverContent = within(container).getByTestId('popover-content')
    expect(popoverContent).toBeInTheDocument()

    // Check if the BookRating component is rendered
    const bookRating = within(popoverContent).getByTestId('book-rating')
    expect(bookRating).toBeInTheDocument()
    expect(bookRating).toHaveAttribute('data-interactive', 'true')
  })

  it('calls handleShelfSelect when a shelf is selected', () => {
    // Reset the mock function
    mockHandleShelfSelect.mockReset()

    // Mock the useBookshelfOptimistic hook
    vi.mocked(useBookshelfOptimistic).mockImplementationOnce(() => ({
      userShelves: [],
      isShelvesLoading: false,
      isShelvesError: false,
      currentShelf: null,
      isBookmarked: false,
      shelfId: null,
      addToShelfMutation: {
        isPending: false,
        mutate: mockAddToShelfMutate,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        variables: undefined,
        reset: vi.fn()
      },
      removeFromShelfMutation: {
        isPending: false,
        mutate: mockRemoveFromShelfMutate,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        variables: undefined,
        reset: vi.fn()
      },
      handleShelfSelect: mockHandleShelfSelect,
      isPending: false
    }))

    const { container } = render(
      <BookActions editionId='edition-1' bookTitle='Test Book' />
    )

    // Find the "Want to Read" button directly by its text content
    const wantToReadButton = Array.from(
      container.querySelectorAll('button')
    ).find((button) => button.textContent?.includes('Want to Read'))

    // Click the button to select the shelf
    if (wantToReadButton) {
      fireEvent.click(wantToReadButton)

      // Check if handleShelfSelect was called with the correct shelf
      expect(mockHandleShelfSelect).toHaveBeenCalledWith('Want to Read')
    } else {
      // If we can't find the button, fail the test
      expect(wantToReadButton).toBeDefined()
    }
  })

  it('handles rating changes correctly', () => {
    // Reset the mock rating mutate function
    mockRatingMutate.mockReset()

    // Mock the useBookshelfOptimistic hook
    vi.mocked(useBookshelfOptimistic).mockImplementationOnce(() => ({
      userShelves: [],
      isShelvesLoading: false,
      isShelvesError: false,
      currentShelf: null,
      isBookmarked: false,
      shelfId: null,
      addToShelfMutation: {
        isPending: false,
        mutate: mockAddToShelfMutate,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        variables: undefined,
        reset: vi.fn()
      },
      removeFromShelfMutation: {
        isPending: false,
        mutate: mockRemoveFromShelfMutate,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        variables: undefined,
        reset: vi.fn()
      },
      handleShelfSelect: mockHandleShelfSelect,
      isPending: false
    }))

    // Mock the useQuery hook to return user rating
    vi.mocked(useQuery).mockImplementation(() => ({
      data: { rating: 3 },
      isLoading: false,
      isError: false,
      error: null,
      status: 'success',
      isPending: false,
      isSuccess: true,
      refetch: vi.fn(),
      promise: Promise.resolve()
    }))

    render(
      <div data-testid='rating-container'>
        <BookActions editionId='edition-1' bookTitle='Test Book' />
      </div>
    )

    const container = screen.getByTestId('rating-container')

    // Toggle the popover to open it
    const toggleButton = within(container).getByTestId('toggle-popover')
    fireEvent.click(toggleButton)

    // Find the BookRating component
    const bookRating = within(container).getByTestId('book-rating')

    // Click on the BookRating component to trigger the rating change
    fireEvent.click(bookRating)

    // Check if the mutation was called with the correct rating
    expect(mockRatingMutate).toHaveBeenCalledWith({ rating: 4 })
  })
})
