import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  render,
  screen,
  fireEvent,
  cleanup,
  within
} from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { BookCardBuyButton } from '@/components/books/book-card/BookCardBuyButton'

// Mock the Button component to capture the onClick handler
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className }: any) => {
    // Store the onClick handler to be called directly in the test
    return (
      <button data-testid='buy-button' className={className} onClick={onClick}>
        {children}
      </button>
    )
  }
}))

// Mock the Lucide icon
vi.mock('lucide-react', () => ({
  ShoppingCart: () => <div data-testid='shopping-cart-icon' />
}))

// Mock the useShoppingCart hook
vi.mock('use-shopping-cart', () => ({
  useShoppingCart: vi.fn()
}))

// Mock the getProductFromBookEdition function
vi.mock('@/lib/stripe/books.stripe.metadata', () => ({
  getProductFromBookEdition: vi.fn().mockImplementation((edition, work) => ({
    id: edition.id,
    name: work.title,
    price: parseInt(edition.price) * 100, // Convert to cents
    currency: 'USD'
  }))
}))

// Import the mocked functions
import { useShoppingCart } from 'use-shopping-cart'
import { getProductFromBookEdition } from '@/lib/stripe/books.stripe.metadata'

// Clean up after each test to remove any elements from the DOM
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('BookCardBuyButton', () => {
  it('renders the buy button with shopping cart icon', () => {
    // Mock the useShoppingCart hook
    const mockAddItem = vi.fn()
    vi.mocked(useShoppingCart).mockReturnValue({
      addItem: mockAddItem
    } as any)

    // Create mock book data
    const mockEdition = {
      id: 'edition-1',
      price: '19.99'
    }

    const mockWork = {
      id: 'work-1',
      title: 'Test Book'
    }

    render(
      <div data-testid='render-test-container'>
        <BookCardBuyButton
          bookEdition={mockEdition as any}
          bookWork={mockWork as any}
        />
      </div>
    )

    // Get the test container to scope our queries
    const testContainer = screen.getByTestId('render-test-container')

    // Check if the button is rendered within our test container
    const button = within(testContainer).getByTestId('buy-button')
    expect(button).toBeInTheDocument()

    // Check if the shopping cart icon is rendered
    expect(
      within(testContainer).getByTestId('shopping-cart-icon')
    ).toBeInTheDocument()

    // Check if the button text is rendered
    expect(button).toHaveTextContent('Buy')
  })
})
