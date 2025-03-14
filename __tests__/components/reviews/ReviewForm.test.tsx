import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor
} from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { ReviewForm } from '@/components/reviews/ReviewForm'

// Mock the necessary modules
vi.mock('@/app/actions/reviews.actions', () => ({
  upsertReview: vi.fn().mockResolvedValue({ id: 'mock-review-id' })
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

// Import the mocked functions
import { upsertReview } from '@/app/actions/reviews.actions'
import { toast } from 'sonner'

// Clean up after each test
afterEach(() => {
  cleanup()
  vi.resetAllMocks()
})

describe('ReviewForm', () => {
  it('renders the form correctly', () => {
    render(<ReviewForm editionId='test-edition-id' />)

    // Check if the form elements are rendered
    expect(screen.getByLabelText('Your Review')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Write your review here...')
    ).toBeInTheDocument()
    expect(screen.getByText('Submit Review')).toBeInTheDocument()
  })

  it('shows validation error for short reviews', async () => {
    render(<ReviewForm editionId='test-edition-id' />)

    // Type a short review (less than 10 characters)
    const textArea = screen.getByPlaceholderText('Write your review here...')
    fireEvent.change(textArea, { target: { value: 'Short' } })

    // Submit the form
    const submitButton = screen.getByText('Submit Review')
    fireEvent.click(submitButton)

    // Check if validation error is displayed
    await waitFor(() => {
      expect(
        screen.getByText('Review must be at least 10 characters.')
      ).toBeInTheDocument()
    })

    // Verify that upsertReview was not called
    expect(upsertReview).not.toHaveBeenCalled()
  })

  it('submits the form with valid data', async () => {
    render(<ReviewForm editionId='test-edition-id' />)

    // Type a valid review
    const textArea = screen.getByPlaceholderText('Write your review here...')
    fireEvent.change(textArea, {
      target: { value: 'This is a valid review with more than 10 characters.' }
    })

    // Submit the form
    const submitButton = screen.getByText('Submit Review')
    fireEvent.click(submitButton)

    // Check if upsertReview was called with the correct data
    await waitFor(() => {
      expect(upsertReview).toHaveBeenCalledWith({
        content: 'This is a valid review with more than 10 characters.',
        editionId: 'test-edition-id'
      })
    })

    // Check if success toast was shown
    expect(toast.success).toHaveBeenCalledWith('Review submitted successfully')
  })

  it('shows editing UI when reviewId is provided', () => {
    render(
      <ReviewForm
        editionId='test-edition-id'
        reviewId='test-review-id'
        defaultValues={{
          content: 'This is an existing review that is being edited.'
        }}
      />
    )

    // Check if the textarea has the existing content
    const textArea = screen.getByPlaceholderText('Write your review here...')
    expect(textArea).toHaveValue(
      'This is an existing review that is being edited.'
    )

    // Check if the button text indicates editing
    expect(screen.getByText('Update Review')).toBeInTheDocument()
  })

  it('calls onSuccess callback after successful submission', async () => {
    const onSuccessMock = vi.fn()

    render(<ReviewForm editionId='test-edition-id' onSuccess={onSuccessMock} />)

    // Type a valid review
    const textArea = screen.getByPlaceholderText('Write your review here...')
    fireEvent.change(textArea, {
      target: { value: 'This is a valid review with more than 10 characters.' }
    })

    // Submit the form
    const submitButton = screen.getByText('Submit Review')
    fireEvent.click(submitButton)

    // Check if onSuccess was called after successful submission
    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalled()
    })
  })

  it('shows cancel button when onCancel prop is provided', () => {
    const onCancelMock = vi.fn()

    render(<ReviewForm editionId='test-edition-id' onCancel={onCancelMock} />)

    // Check if cancel button is displayed
    const cancelButton = screen.getByText('Cancel')
    expect(cancelButton).toBeInTheDocument()

    // Click the cancel button
    fireEvent.click(cancelButton)

    // Check if onCancel was called
    expect(onCancelMock).toHaveBeenCalled()
  })

  it('shows error toast when submission fails', async () => {
    // Mock upsertReview to reject
    vi.mocked(upsertReview).mockRejectedValueOnce(
      new Error('Submission failed')
    )

    render(<ReviewForm editionId='test-edition-id' />)

    // Type a valid review
    const textArea = screen.getByPlaceholderText('Write your review here...')
    fireEvent.change(textArea, {
      target: { value: 'This is a valid review with more than 10 characters.' }
    })

    // Submit the form
    const submitButton = screen.getByText('Submit Review')
    fireEvent.click(submitButton)

    // Check if error toast was shown
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to submit review')
    })
  })
})
