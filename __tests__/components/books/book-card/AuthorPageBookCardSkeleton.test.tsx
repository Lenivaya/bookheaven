import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, within } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { AuthorPageBookCardSkeleton } from '@/components/books/book-card/AuthorPageBookCardSkeleton'

// Mock the UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid='author-page-card' className={className}>
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

describe('AuthorPageBookCardSkeleton', () => {
  it('renders the skeleton card with all skeleton elements', () => {
    const { container } = render(
      <div data-testid='test-container-1'>
        <AuthorPageBookCardSkeleton />
      </div>
    )

    // Get the test container to scope our queries
    const testContainer = screen.getByTestId('test-container-1')

    // Check if the card is rendered within our test container
    const card = within(testContainer).getByTestId('author-page-card')
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
        skeleton.className.includes('h-[180px]') ||
        skeleton.className.includes('h-[210px]') ||
        skeleton.className.includes('h-[240px]')
    )
    expect(coverSkeleton).toBeInTheDocument()

    // Check for the title skeleton
    const titleSkeleton = skeletons.find(
      (skeleton) =>
        skeleton.className.includes('h-6') || skeleton.className.includes('h-7')
    )
    expect(titleSkeleton).toBeInTheDocument()

    // Check for the description skeletons
    const descriptionSkeletons = skeletons.filter(
      (skeleton) =>
        skeleton.className.includes('h-4') &&
        (skeleton.className.includes('w-full') ||
          skeleton.className.includes('w-3/4'))
    )
    expect(descriptionSkeletons.length).toBeGreaterThanOrEqual(3)

    // Check for the price skeleton
    const priceSkeleton = skeletons.find(
      (skeleton) =>
        skeleton.className.includes('h-8') &&
        skeleton.className.includes('w-24')
    )
    expect(priceSkeleton).toBeInTheDocument()
  })

  it('applies custom className when provided', () => {
    const customClass = 'custom-test-class'
    const { container } = render(
      <div data-testid='test-container-2'>
        <AuthorPageBookCardSkeleton className={customClass} />
      </div>
    )

    // Get the test container to scope our queries
    const testContainer = screen.getByTestId('test-container-2')

    // Check if the custom class is applied to the card within our test container
    const card = within(testContainer).getByTestId('author-page-card')
    expect(card).toHaveClass(customClass)
  })
})
