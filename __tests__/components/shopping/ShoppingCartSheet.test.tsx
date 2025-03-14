import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor
} from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { ShoppingCartSheet } from '@/components/shopping/shopping-cart-sheet/ShoppingCartSheet'

// Mock the necessary modules
vi.mock('@/app/actions/payments.actions', () => ({
  createCheckoutSessionForBookEditions: vi
    .fn()
    .mockResolvedValue('mock-checkout-session-id')
}))

vi.mock('next/image', () => ({
  default: ({ src, alt, className }: any) => (
    <img src={src} alt={alt} className={className} />
  )
}))

vi.mock('next-view-transitions', () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}))

vi.mock('@clerk/nextjs', () => ({
  SignedIn: ({ children }: any) => (
    <div data-testid='signed-in'>{children}</div>
  ),
  SignedOut: ({ children }: any) => (
    <div data-testid='signed-out'>{children}</div>
  ),
  SignInButton: ({ children }: any) => (
    <div data-testid='sign-in-button'>{children}</div>
  )
}))

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn()
  }
}))

// Mock the UI components
vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: any) => <div data-testid='sheet'>{children}</div>,
  SheetTrigger: ({ children }: any) => (
    <div data-testid='sheet-trigger'>{children}</div>
  ),
  SheetContent: ({ children }: any) => (
    <div data-testid='sheet-content'>{children}</div>
  ),
  SheetHeader: ({ children }: any) => (
    <div data-testid='sheet-header'>{children}</div>
  ),
  SheetFooter: ({ children }: any) => (
    <div data-testid='sheet-footer'>{children}</div>
  ),
  SheetTitle: ({ children }: any) => (
    <div data-testid='sheet-title'>{children}</div>
  )
}))

vi.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog: ({ children }: any) => (
    <div data-testid='alert-dialog'>{children}</div>
  ),
  AlertDialogTrigger: ({ children }: any) => (
    <div data-testid='alert-dialog-trigger'>{children}</div>
  ),
  AlertDialogContent: ({ children }: any) => (
    <div data-testid='alert-dialog-content'>{children}</div>
  ),
  AlertDialogHeader: ({ children }: any) => (
    <div data-testid='alert-dialog-header'>{children}</div>
  ),
  AlertDialogFooter: ({ children }: any) => (
    <div data-testid='alert-dialog-footer'>{children}</div>
  ),
  AlertDialogTitle: ({ children }: any) => (
    <div data-testid='alert-dialog-title'>{children}</div>
  ),
  AlertDialogDescription: ({ children }: any) => (
    <div data-testid='alert-dialog-description'>{children}</div>
  ),
  AlertDialogAction: ({ onClick, children }: any) => (
    <button data-testid='alert-dialog-action' onClick={onClick}>
      {children}
    </button>
  ),
  AlertDialogCancel: ({ children }: any) => (
    <button data-testid='alert-dialog-cancel'>{children}</button>
  )
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({
    onClick,
    children,
    className,
    'aria-label': ariaLabel,
    disabled
  }: any) => (
    <button
      onClick={onClick}
      className={className}
      aria-label={ariaLabel}
      disabled={disabled}
      data-testid={`button-${ariaLabel || (children?.toString?.() || 'default').replace(/\s+/g, '-').toLowerCase()}`}
    >
      {children}
    </button>
  )
}))

vi.mock('@/components/ui/separator', () => ({
  Separator: () => <div data-testid='separator' />
}))

// Mock the use-shopping-cart hook
const mockCartDetails = {
  'item-1': {
    id: 'item-1',
    name: 'Test Book',
    price: 1999,
    currency: 'USD',
    value: 1999,
    quantity: 1,
    formattedValue: '$19.99',
    image: '/test-image.jpg',
    description: 'Test book description'
  }
}

// Create a mock for useShoppingCart
const mockRemoveItem = vi.fn()
const mockIncrementItem = vi.fn()
const mockDecrementItem = vi.fn()
const mockRedirectToCheckout = vi.fn().mockResolvedValue({ error: null })
const mockClearCart = vi.fn()

// Default mock implementation
let mockUseShoppingCartImplementation = {
  cartCount: 1,
  cartDetails: mockCartDetails,
  removeItem: mockRemoveItem,
  incrementItem: mockIncrementItem,
  decrementItem: mockDecrementItem,
  redirectToCheckout: mockRedirectToCheckout,
  formattedTotalPrice: '$19.99',
  clearCart: mockClearCart
}

// Mock the useShoppingCart hook
vi.mock('use-shopping-cart', () => ({
  useShoppingCart: () => mockUseShoppingCartImplementation
}))

// Import the mocked functions
import { createCheckoutSessionForBookEditions } from '@/app/actions/payments.actions'
import { toast } from 'sonner'

// Add a type definition for the cart details
type CartDetails = typeof mockCartDetails

// Clean up after each test
afterEach(() => {
  cleanup()
  vi.resetAllMocks()

  // Reset the mock implementation to default
  mockUseShoppingCartImplementation = {
    cartCount: 1,
    cartDetails: mockCartDetails,
    removeItem: mockRemoveItem,
    incrementItem: mockIncrementItem,
    decrementItem: mockDecrementItem,
    redirectToCheckout: mockRedirectToCheckout,
    formattedTotalPrice: '$19.99',
    clearCart: mockClearCart
  }
})

describe('ShoppingCartSheet', () => {
  it('renders the shopping cart with trigger children', () => {
    render(
      <ShoppingCartSheet>
        <button>Open Cart</button>
      </ShoppingCartSheet>
    )

    expect(screen.getByText('Open Cart')).toBeInTheDocument()
  })

  it('displays cart items when cart has items', async () => {
    render(
      <ShoppingCartSheet>
        <button>Open Cart</button>
      </ShoppingCartSheet>
    )

    // With our mocked Sheet component, the content is always visible
    expect(screen.getByText('Your Cart (1)')).toBeInTheDocument()
    expect(screen.getByText('Test Book')).toBeInTheDocument()
    expect(screen.getByText('Test book description')).toBeInTheDocument()

    // Check for the item price and subtotal
    const priceTexts = screen.getAllByText('$19.99')
    expect(priceTexts.length).toBeGreaterThanOrEqual(1)
  })

  it('displays empty cart message when cart is empty', () => {
    // Override the mock implementation for this test
    mockUseShoppingCartImplementation = {
      cartCount: 0,
      cartDetails: {} as CartDetails, // Use the proper type
      removeItem: mockRemoveItem,
      incrementItem: mockIncrementItem,
      decrementItem: mockDecrementItem,
      redirectToCheckout: mockRedirectToCheckout,
      formattedTotalPrice: '$0.00',
      clearCart: mockClearCart
    }

    render(
      <ShoppingCartSheet>
        <button>Open Cart</button>
      </ShoppingCartSheet>
    )

    // With our mocked Sheet component, the content is always visible
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    expect(
      screen.getByText('Add items to your cart to see them here')
    ).toBeInTheDocument()
  })

  it('calls incrementItem when increase quantity button is clicked', () => {
    render(
      <ShoppingCartSheet>
        <button>Open Cart</button>
      </ShoppingCartSheet>
    )

    // Find and click the increment button using aria-label instead of data-testid
    const increaseButton = screen.getByLabelText('Increase quantity')
    fireEvent.click(increaseButton)

    // Check if incrementItem was called with the correct item id
    expect(mockIncrementItem).toHaveBeenCalledWith('item-1')
  })

  it('calls removeItem when remove button is clicked', () => {
    render(
      <ShoppingCartSheet>
        <button>Open Cart</button>
      </ShoppingCartSheet>
    )

    // Find and click the remove button
    const removeButton = screen.getByText('Remove')
    fireEvent.click(removeButton)

    // Check if removeItem was called with the correct item id
    expect(mockRemoveItem).toHaveBeenCalledWith('item-1')
  })

  it('shows sign in button for signed out users', () => {
    render(
      <ShoppingCartSheet>
        <button>Open Cart</button>
      </ShoppingCartSheet>
    )

    // Check if sign in button is displayed for signed out users
    expect(screen.getByTestId('signed-out')).toBeInTheDocument()
    expect(screen.getByText('Sign in to checkout')).toBeInTheDocument()
  })

  it('shows checkout button for signed in users', () => {
    render(
      <ShoppingCartSheet>
        <button>Open Cart</button>
      </ShoppingCartSheet>
    )

    // Check if checkout button is displayed for signed in users
    expect(screen.getByTestId('signed-in')).toBeInTheDocument()
    expect(screen.getByText('Checkout')).toBeInTheDocument()
  })
})
