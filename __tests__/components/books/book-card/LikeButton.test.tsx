import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { LikeButton } from '@/components/books/book-card/LikeButton'

// Create a counter for unique heart icon IDs
let heartIconCounter = 0

// Mock the Lucide icon
vi.mock('lucide-react', () => ({
  Heart: (props: any) => {
    // Increment the counter for each heart icon
    const iconId = `heart-icon-${++heartIconCounter}`
    return (
      <svg
        data-testid={iconId}
        data-heart-state={
          props.className.includes('fill-current') ? 'filled' : 'empty'
        }
        className={props.className}
        onClick={props.onClick}
      />
    )
  }
}))

// Mock the Button component
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, className, onClick, disabled }: any) => (
    <button
      data-testid='like-button'
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}))

// Mock the useLikeOptimistic hook
vi.mock('@/hooks/useLikeOptimistic', () => ({
  useLikeOptimistic: vi.fn()
}))

// Mock the book actions
vi.mock('@/app/actions/books.actions', () => ({
  hasLikedBook: vi.fn(),
  toggleBookLike: vi.fn()
}))

// Import the mocked useLikeOptimistic
import { useLikeOptimistic } from '@/hooks/useLikeOptimistic'

describe('LikeButton', () => {
  const mockMutate = vi.fn()

  beforeEach(() => {
    // Reset counter before each test
    heartIconCounter = 0

    // Reset mocks
    vi.clearAllMocks()

    // Clean up the DOM
    cleanup()
  })

  it('renders with liked state', () => {
    // Mock the hook to return liked state
    vi.mocked(useLikeOptimistic).mockReturnValue({
      isLiked: true,
      isLikeStatusLoading: false,
      likeMutation: {
        mutate: mockMutate,
        isPending: false
      }
    } as any)

    const { container } = render(
      <LikeButton bookEditionId='test-id' isHovering={false} />
    )

    // Check if the button is rendered
    const button = screen.getByTestId('like-button')
    expect(button).toBeInTheDocument()

    // Check if the heart icon has the filled class
    // Use a more specific selector that includes the state
    const heartIcon = container.querySelector('[data-heart-state="filled"]')
    expect(heartIcon).toBeInTheDocument()
    expect(heartIcon).toHaveClass('fill-current')

    // Check if the button has the liked color class
    expect(button).toHaveClass('text-red-500')
  })

  it('renders with unliked state and shows when hovering', () => {
    // Mock the hook to return unliked state
    vi.mocked(useLikeOptimistic).mockReturnValue({
      isLiked: false,
      isLikeStatusLoading: false,
      likeMutation: {
        mutate: mockMutate,
        isPending: false
      }
    } as any)

    const { container } = render(
      <LikeButton bookEditionId='test-id' isHovering={true} />
    )

    // Check if the container is visible (opacity-100)
    const containerDiv = container.firstChild as HTMLElement
    expect(containerDiv).toHaveClass('opacity-100')

    // Check if the heart icon does not have the filled class
    // Use a more specific selector that includes the state
    const heartIcon = container.querySelector('[data-heart-state="empty"]')
    expect(heartIcon).toBeInTheDocument()
    expect(heartIcon).toHaveClass('fill-none')

    // Check if the button has the unliked color class
    const button = screen.getByTestId('like-button')
    expect(button).toHaveClass('text-muted-foreground')
  })

  it('is hidden when not liked and not hovering', () => {
    // Mock the hook to return unliked state
    vi.mocked(useLikeOptimistic).mockReturnValue({
      isLiked: false,
      isLikeStatusLoading: false,
      likeMutation: {
        mutate: mockMutate,
        isPending: false
      }
    } as any)

    const { container } = render(
      <LikeButton bookEditionId='test-id' isHovering={false} />
    )

    // Check if the container is hidden (opacity-0)
    const containerDiv = container.firstChild as HTMLElement
    expect(containerDiv).toHaveClass('opacity-0')
  })

  it('shows loading state when mutation is pending', () => {
    // Mock the hook to return pending mutation state
    vi.mocked(useLikeOptimistic).mockReturnValue({
      isLiked: false,
      isLikeStatusLoading: false,
      likeMutation: {
        mutate: mockMutate,
        isPending: true
      }
    } as any)

    const { container } = render(
      <LikeButton bookEditionId='test-id' isHovering={true} />
    )

    // Check if the heart icon has the animate-pulse class
    // Use a more specific selector
    const heartIcon = container.querySelector('svg')
    expect(heartIcon).toBeInTheDocument()
    expect(heartIcon).toHaveClass('animate-pulse')
  })

  it('calls mutation when clicked', () => {
    // Create a spy for the mutate function
    const mutateSpy = vi.fn()

    // Mock the hook to return unliked state with our spy
    vi.mocked(useLikeOptimistic).mockReturnValue({
      isLiked: false,
      isLikeStatusLoading: false,
      likeMutation: {
        mutate: mutateSpy,
        isPending: false
      }
    } as any)

    // Render the component
    const { container } = render(
      <LikeButton bookEditionId='test-id' isHovering={true} />
    )

    // Get the button element
    const button = screen.getByTestId('like-button')

    // Simulate a click on the button
    fireEvent.click(button)

    // Check if our spy was called
    expect(mutateSpy).toHaveBeenCalled()
  })

  it('is disabled when loading', () => {
    // Mock the hook to return loading state
    vi.mocked(useLikeOptimistic).mockReturnValue({
      isLiked: false,
      isLikeStatusLoading: true,
      likeMutation: {
        mutate: mockMutate,
        isPending: false
      }
    } as any)

    render(<LikeButton bookEditionId='test-id' isHovering={true} />)

    // Check if the button is disabled
    const button = screen.getByTestId('like-button')
    expect(button).toBeDisabled()
  })
})
