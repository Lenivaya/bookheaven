import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, within } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { BookCardSkeleton } from '@/components/books/book-card/BookCardSkeleton'

// Mock the UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid='book-card-skeleton' className={className}>
      {children}
    </div>
  )
}))

vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: any) => (
    <div data-testid='skeleton' className={className} />
  )
}))

// Clean up after each test to remove any elements from the DOM
afterEach(() => {
  cleanup()
})

describe('BookCardSkeleton', () => {
  it('renders the skeleton card with all skeleton elements', () => {
    const { container } = render(
      <div data-testid='book-skeleton-test-container'>
        <BookCardSkeleton />
      </div>
    )

    // Get the test container to scope our queries
    const testContainer = screen.getByTestId('book-skeleton-test-container')

    // Check if the card is rendered within our test container
    const card = within(testContainer).getByTestId('book-card-skeleton')
    expect(card).toBeInTheDocument()

    // Check if the card has the correct classes
    expect(card).toHaveClass('h-full')
    expect(card).toHaveClass('overflow-hidden')

    // Check if all skeleton elements are rendered
    const skeletons = within(testContainer).getAllByTestId('skeleton')

    // We should have multiple skeleton elements for different parts of the card
    expect(skeletons.length).toBeGreaterThan(5)

    // Check for the book cover skeleton
    const coverSkeleton = skeletons.find(
      (skeleton) =>
        skeleton.className.includes('h-full') &&
        skeleton.className.includes('w-full')
    )
    expect(coverSkeleton).toBeInTheDocument()

    // Check for the title skeleton
    const titleSkeleton = skeletons.find((skeleton) =>
      skeleton.className.includes('max-w-[150px]')
    )
    expect(titleSkeleton).toBeInTheDocument()

    // Check for the author skeleton
    const authorSkeleton = skeletons.find((skeleton) =>
      skeleton.className.includes('w-3/4')
    )
    expect(authorSkeleton).toBeInTheDocument()

    // Check for the description skeletons
    const descriptionSkeletons = skeletons.filter(
      (skeleton) =>
        skeleton.className.includes('h-2.5') ||
        skeleton.className.includes('h-3')
    )
    expect(descriptionSkeletons.length).toBeGreaterThanOrEqual(2)

    // Check for the tag skeletons
    const tagSkeletons = skeletons.filter((skeleton) =>
      skeleton.className.includes('rounded-full')
    )
    expect(tagSkeletons.length).toBe(3)
  })
})
