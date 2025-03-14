import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import {
  ReviewCard,
  ReviewCardSkeleton
} from '@/components/reviews/review-card/ReviewCard'
import { Review, Rating } from '@/db/schema'

// Mock the child components
vi.mock('@/components/reviews/review-card/ReviewUserInfo', () => ({
  ReviewUserInfo: vi.fn(({ userId, createdAt }) => (
    <div data-testid='review-user-info'>
      User: {userId}, Created: {createdAt.toISOString()}
    </div>
  ))
}))

vi.mock('@/components/reviews/review-card/ReviewActions', () => ({
  ReviewActions: vi.fn(({ review }) => (
    <div data-testid='review-actions'>Actions for review: {review.id}</div>
  ))
}))

vi.mock('@/components/books/book-card/BookRating', () => ({
  BookRating: vi.fn(({ rating }) => (
    <div data-testid='book-rating'>Rating: {rating}</div>
  ))
}))

// Mock the Suspense component
vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    Suspense: ({ children }: { children: React.ReactNode }) => <>{children}</>
  }
})

describe('ReviewCard Components', () => {
  describe('ReviewCardSkeleton', () => {
    it('renders the skeleton loader', () => {
      const { container } = render(<ReviewCardSkeleton />)

      // Check if the skeleton elements are rendered
      expect(
        container.querySelectorAll('.animate-pulse').length
      ).toBeGreaterThan(0)

      // Check if the card is rendered with the correct classes
      const cardElement = container.firstChild
      expect(cardElement).toHaveClass('hover:shadow-lg')
      expect(cardElement).toHaveClass('hover:border-primary/20')
    })
  })

  describe('ReviewCard', () => {
    // Sample review data for testing
    const mockReview: Review = {
      id: 'review-1',
      userId: 'user-1',
      editionId: 'edition-1',
      content: 'This is a test review content.',
      created_at: new Date('2023-01-01'),
      updated_at: null,
      deleted_at: null,
      likesCount: 0,
      isVerifiedPurchase: false
    }

    const mockRating: Rating = {
      id: 'rating-1',
      userId: 'user-1',
      editionId: 'edition-1',
      rating: 4,
      created_at: new Date('2023-01-01'),
      updated_at: null,
      deleted_at: null
    }

    it('renders the review card with content', () => {
      render(<ReviewCard review={mockReview} />)

      // Check if the review content is displayed
      expect(
        screen.getByText('This is a test review content.')
      ).toBeInTheDocument()

      // Check if the ReviewUserInfo component is rendered
      expect(screen.getByTestId('review-user-info')).toBeInTheDocument()

      // Check if the ReviewActions component is rendered
      expect(screen.getByTestId('review-actions')).toBeInTheDocument()
    })

    it('renders the rating when provided', () => {
      render(<ReviewCard review={mockReview} rating={mockRating} />)

      // Check if the BookRating component is rendered
      expect(screen.getByTestId('book-rating')).toBeInTheDocument()

      // Check if the rating value is displayed
      expect(screen.getByText('4/5')).toBeInTheDocument()
    })

    it('applies custom className when provided', () => {
      const { container } = render(
        <ReviewCard review={mockReview} className='custom-class' />
      )

      // Check if the custom class is applied to the card
      const cardElement = container.firstChild
      expect(cardElement).toHaveClass('custom-class')
    })
  })
})
