import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { GoBackButton } from '@/components/layout/GoBackButton'

// Create a mock for the back function
const mockBack = vi.fn()

// Mock the next/navigation module
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    back: mockBack
  })
}))

describe('GoBackButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with default text', () => {
    render(<GoBackButton />)

    // Check if the default text is rendered
    expect(screen.getByText('Go back')).toBeInTheDocument()

    // Check if the arrow icon is rendered
    expect(document.querySelector('svg')).toBeInTheDocument()
  })

  it('renders with custom text', () => {
    render(<GoBackButton text='Return to previous page' />)

    // Check if the custom text is rendered
    expect(screen.getByText('Return to previous page')).toBeInTheDocument()
  })

  it('calls router.back when clicked', () => {
    const { container } = render(<GoBackButton />)

    // Get the main div element and click it
    const buttonElement = container.firstChild as HTMLElement
    fireEvent.click(buttonElement)

    // Check if router.back was called
    expect(mockBack).toHaveBeenCalledTimes(1)
  })

  it('calls custom onClick handler when provided', () => {
    // Create a mock function for onClick
    const mockOnClick = vi.fn()

    const { container } = render(<GoBackButton onClick={mockOnClick} />)

    // Get the main div element and click it
    const buttonElement = container.firstChild as HTMLElement
    fireEvent.click(buttonElement)

    // Check if both the custom onClick and router.back were called
    expect(mockOnClick).toHaveBeenCalledTimes(1)
    expect(mockBack).toHaveBeenCalledTimes(1)
  })

  it('has the correct styling', () => {
    const { container } = render(<GoBackButton />)

    // Get the main div element
    const buttonElement = container.firstChild as HTMLElement

    // Check if it has the correct classes
    expect(buttonElement).toHaveClass('group')
    expect(buttonElement).toHaveClass('text-muted-foreground')
    expect(buttonElement).toHaveClass('hover:text-primary')
    expect(buttonElement).toHaveClass('cursor-pointer')

    // Check if the arrow icon has the transition class
    const arrowIcon = document.querySelector('svg')
    expect(arrowIcon).toHaveClass('transition-transform')
  })
})
