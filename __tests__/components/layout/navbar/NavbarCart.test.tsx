import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { NavbarCart } from '@/components/layout/navbar/NavbarCart'

// Create a counter for unique button IDs
let buttonCounter = 0

// Mock the ShoppingCartSheet component
vi.mock('@/components/shopping/shopping-cart-sheet/ShoppingCartSheet', () => ({
  ShoppingCartSheet: ({ children }: any) => (
    <div data-testid='shopping-cart-sheet'>{children}</div>
  )
}))

// Mock the Button component
vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    className,
    variant,
    size,
    'aria-label': ariaLabel
  }: any) => {
    buttonCounter++
    return (
      <button
        data-testid={`button-${variant}-${size}-${buttonCounter}`}
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </button>
    )
  }
}))

// Mock the Lucide icon
vi.mock('lucide-react', () => ({
  ShoppingCart: () => <div data-testid='shopping-cart-icon'>Cart Icon</div>
}))

// Mock the useShoppingCart hook
vi.mock('use-shopping-cart', () => ({
  useShoppingCart: vi.fn()
}))

// Import the mocked useShoppingCart
import { useShoppingCart } from 'use-shopping-cart'

describe('NavbarCart', () => {
  beforeEach(() => {
    // Reset the counter before each test
    buttonCounter = 0
  })

  it('renders the cart button without count when cart is empty', () => {
    // Mock the useShoppingCart hook to return an empty cart
    vi.mocked(useShoppingCart).mockReturnValue({
      cartCount: 0,
      formattedTotalPrice: '$0.00'
    } as any)

    const { container } = render(<NavbarCart />)

    // Check if the button is rendered (using querySelector to find the first matching element)
    const button = container.querySelector('[data-testid^="button-ghost-sm-"]')
    expect(button).toBeInTheDocument()

    // Check if the cart icon is rendered
    expect(screen.getByTestId('shopping-cart-icon')).toBeInTheDocument()

    // Check that the cart count element is not present
    const countElement = container.querySelector('.absolute.-right-2.-top-2')
    expect(countElement).toBeNull()

    // Check that the price element is not present
    const priceElement = container.querySelector('.ml-2.text-sm.font-semibold')
    expect(priceElement).toBeNull()
  })

  it('renders the cart button with count and price when cart has items', () => {
    // Mock the useShoppingCart hook to return a cart with items
    vi.mocked(useShoppingCart).mockReturnValue({
      cartCount: 3,
      formattedTotalPrice: '$99.99'
    } as any)

    const { container } = render(<NavbarCart />)

    // Check if the button is rendered (using querySelector to find the first matching element)
    const button = container.querySelector('[data-testid^="button-ghost-sm-"]')
    expect(button).toBeInTheDocument()

    // Check if the cart count is rendered
    expect(screen.getByText('3')).toBeInTheDocument()

    // Check if the formatted total price is rendered
    expect(screen.getByText('$99.99')).toBeInTheDocument()
  })
})
