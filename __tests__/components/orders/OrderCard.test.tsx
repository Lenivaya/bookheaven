import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { OrderCard } from '@/components/orders/order-card/OrderCard'

// Mock the child components
vi.mock('@/components/orders/order-card/OrderCardBooks', () => ({
  OrderCardBooks: vi.fn(({ items }) => (
    <div data-testid='order-books'>{items.length} books</div>
  ))
}))

vi.mock('@/components/orders/order-card/OrderCardCancelButton', () => ({
  OrderCardCancelButton: vi.fn(({ orderId }) => (
    <button data-testid='cancel-button'>Cancel Order {orderId}</button>
  ))
}))

vi.mock('@/components/orders/order-card/OrderUserInfo', () => ({
  OrderUserInfo: vi.fn(({ userId, createdAt }) => (
    <div data-testid='user-info'>
      User: {userId}, Created: {createdAt.toISOString()}
    </div>
  ))
}))

// Mock the UI components
vi.mock('@/components/ui/copyable-text', () => ({
  CopyableText: vi.fn(({ text, displayText }) => (
    <span data-testid='copyable-text' data-text={text}>
      {displayText}
    </span>
  ))
}))

vi.mock('next-view-transitions', () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}))

// Mock the Suspense component
vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    Suspense: ({ children }: { children: React.ReactNode }) => <>{children}</>
  }
})

// Mock formatCurrency function
vi.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
  formatCurrency: (amount: string) => `$${amount}`
}))

describe('OrderCard', () => {
  // Sample order data for testing
  const mockOrder = {
    id: 'order123456789',
    userId: 'user123456789',
    status: 'Delivered',
    total: '99.99',
    stripeSessionId: 'cs_test_123456789abcdefghijklmnopqrstuvwxyz',
    created_at: new Date('2023-01-01'),
    updated_at: null,
    deleted_at: null,
    shippingAddress: {
      userId: 'user123456789',
      orderId: 'order123456789',
      address: {
        line1: '123 Main St',
        line2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'US'
      },
      created_at: new Date('2023-01-01'),
      updated_at: null,
      deleted_at: null,
      carrier: null,
      tracking_number: null,
      name: 'John Doe',
      phone: null
    },
    items: [
      {
        id: 'item1',
        orderId: 'order123456789',
        editionId: 'edition1',
        quantity: 1,
        price: '29.99',
        created_at: new Date('2023-01-01'),
        updated_at: null,
        deleted_at: null,
        edition: {
          id: 'edition1',
          title: 'Book Title 1',
          price: '29.99',
          coverImage: '/images/book1.jpg',
          bookId: 'book1',
          format: 'Paperback',
          created_at: new Date('2023-01-01'),
          updated_at: null,
          deleted_at: null
        }
      },
      {
        id: 'item2',
        orderId: 'order123456789',
        editionId: 'edition2',
        quantity: 2,
        price: '34.99',
        created_at: new Date('2023-01-01'),
        updated_at: null,
        deleted_at: null,
        edition: {
          id: 'edition2',
          title: 'Book Title 2',
          price: '34.99',
          coverImage: '/images/book2.jpg',
          bookId: 'book2',
          format: 'Hardcover',
          created_at: new Date('2023-01-01'),
          updated_at: null,
          deleted_at: null
        }
      }
    ]
  }

  it('renders the order card with correct information', () => {
    render(<OrderCard order={mockOrder as any} />)

    // Check if the order number is displayed
    expect(screen.getByText(/Order #/i)).toBeInTheDocument()

    // Check if the status badge is displayed
    expect(screen.getByText('Delivered')).toBeInTheDocument()

    // Check if the OrderUserInfo component is rendered
    expect(screen.getByTestId('user-info')).toBeInTheDocument()

    // Check if the OrderCardBooks component is rendered
    expect(screen.getByTestId('order-books')).toBeInTheDocument()

    // Check if the shipping address is displayed
    expect(screen.getByText('Shipping Address')).toBeInTheDocument()

    // Check if the cancel button is rendered
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument()

    // Check if the view details link is rendered
    expect(screen.getByText('View Details')).toBeInTheDocument()
  })

  it('displays the correct status color based on order status', () => {
    // Test with 'Delivered' status
    render(<OrderCard order={mockOrder as any} />)

    // Find all elements with the text 'Delivered'
    const deliveredElements = screen.getAllByText('Delivered')

    // Find the one that has the bg-green-500 class (should be the badge)
    const badge = deliveredElements.find((element) =>
      element.classList.contains('bg-green-500')
    )

    // Check if we found the badge and it has the correct class
    expect(badge).toBeDefined()
    expect(badge).toHaveClass('bg-green-500')
  })
})
