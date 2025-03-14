import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { BookRating } from '@/components/books/book-card/BookRating'

// Create a counter for unique star IDs to avoid duplicate test IDs
let starIconCounter = 0

// Mock the Lucide icon
vi.mock('lucide-react', () => ({
  Star: (props: any) => {
    starIconCounter++
    return (
      <svg
        data-testid={`star-icon-${starIconCounter}`}
        className={props.className}
        onClick={props.onClick}
        onMouseEnter={props.onMouseEnter}
      />
    )
  }
}))

// Mock the Skeleton component
vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: any) => (
    <div data-testid='skeleton' className={className} />
  )
}))

describe('BookRating', () => {
  beforeEach(() => {
    // Reset counter before each test
    starIconCounter = 0
  })

  it('renders the correct number of stars', () => {
    const { container } = render(<BookRating rating={3} maxRating={5} />)

    // Check if 5 stars are rendered
    const stars = container.querySelectorAll('[data-testid^="star-icon-"]')
    expect(stars.length).toBe(5)
  })

  it('fills the correct number of stars based on rating', () => {
    const { container } = render(<BookRating rating={3} maxRating={5} />)

    // Get all stars
    const stars = container.querySelectorAll('[data-testid^="star-icon-"]')

    // Check if the first 3 stars have the filled class
    for (let i = 0; i < 3; i++) {
      expect(stars[i]).toHaveClass('fill-amber-400')
    }

    // Check if the last 2 stars don't have the filled class
    for (let i = 3; i < 5; i++) {
      expect(stars[i]).not.toHaveClass('fill-amber-400')
    }
  })

  it('renders skeleton when loading', () => {
    const { container } = render(<BookRating isLoading={true} maxRating={5} />)

    // Check if skeletons are rendered instead of stars
    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons.length).toBe(5)

    // Check that no stars are rendered
    const stars = container.querySelectorAll('[data-testid^="star-icon-"]')
    expect(stars.length).toBe(0)
  })

  it('applies the correct size classes', () => {
    const { container } = render(<BookRating size='lg' />)

    // Check if stars have the large size class
    const stars = container.querySelectorAll('[data-testid^="star-icon-"]')
    expect(stars[0]).toHaveClass('h-5')
    expect(stars[0]).toHaveClass('w-5')
  })

  it('calls onRatingChange when interactive and clicked', () => {
    const handleRatingChange = vi.fn()
    const { container } = render(
      <BookRating interactive={true} onRatingChange={handleRatingChange} />
    )

    // Get the third star
    const stars = container.querySelectorAll('[data-testid^="star-icon-"]')
    const thirdStar = stars[2]

    // Click the third star
    fireEvent.click(thirdStar)

    // Check if onRatingChange was called with the correct rating
    expect(handleRatingChange).toHaveBeenCalledWith(3)
  })

  it('does not call onRatingChange when not interactive', () => {
    const handleRatingChange = vi.fn()
    const { container } = render(
      <BookRating interactive={false} onRatingChange={handleRatingChange} />
    )

    // Get the third star
    const stars = container.querySelectorAll('[data-testid^="star-icon-"]')
    const thirdStar = stars[2]

    // Click the third star
    fireEvent.click(thirdStar)

    // Check that onRatingChange was not called
    expect(handleRatingChange).not.toHaveBeenCalled()
  })
})
