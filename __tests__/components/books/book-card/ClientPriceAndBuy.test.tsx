import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, within } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { ClientPriceAndBuy } from '@/components/books/book-card/ClientPriceAndBuy'

// Mock the child components
vi.mock('@/components/books/book-card/BookPriceDisplay', () => ({
  BookPriceDisplay: ({ price, salePrice, isOnSale }: any) => (
    <div
      data-testid='book-price-display'
      data-price={price}
      data-sale-price={salePrice || ''}
      data-is-on-sale={isOnSale.toString()}
    >
      Price Display
    </div>
  )
}))

vi.mock('@/components/books/book-card/BookCardBuyButton', () => ({
  BookCardBuyButton: ({ bookEdition, bookWork }: any) => (
    <div
      data-testid='book-card-buy-button'
      data-edition-id={bookEdition.id}
      data-work-id={bookWork.id}
    >
      Buy Button
    </div>
  )
}))

// Clean up after each test to remove any elements from the DOM
afterEach(() => {
  cleanup()
})

describe('ClientPriceAndBuy', () => {
  it('renders BookPriceDisplay with correct props', () => {
    // Create mock book data
    const mockEdition = {
      id: 'edition-1',
      price: '19.99',
      salePrice: '14.99',
      isOnSale: true
    }

    const mockWork = {
      id: 'work-1',
      title: 'Test Book'
    }

    render(
      <div data-testid='price-display-container'>
        <ClientPriceAndBuy
          price={mockEdition.price}
          salePrice={mockEdition.salePrice}
          isOnSale={mockEdition.isOnSale}
          bookEdition={mockEdition as any}
          bookWork={mockWork as any}
        />
      </div>
    )

    // Get the test container to scope our queries
    const container = screen.getByTestId('price-display-container')

    // Check if BookPriceDisplay is rendered with correct props
    const priceDisplay = within(container).getByTestId('book-price-display')
    expect(priceDisplay).toBeInTheDocument()
    expect(priceDisplay).toHaveAttribute('data-price', '19.99')
    expect(priceDisplay).toHaveAttribute('data-sale-price', '14.99')
    expect(priceDisplay).toHaveAttribute('data-is-on-sale', 'true')
  })

  it('renders BookCardBuyButton with correct props', () => {
    // Create mock book data
    const mockEdition = {
      id: 'edition-1',
      price: '19.99',
      salePrice: null,
      isOnSale: false
    }

    const mockWork = {
      id: 'work-1',
      title: 'Test Book'
    }

    render(
      <div data-testid='buy-button-container'>
        <ClientPriceAndBuy
          price={mockEdition.price}
          salePrice={mockEdition.salePrice}
          isOnSale={mockEdition.isOnSale}
          bookEdition={mockEdition as any}
          bookWork={mockWork as any}
        />
      </div>
    )

    // Get the test container to scope our queries
    const container = screen.getByTestId('buy-button-container')

    // Check if BookCardBuyButton is rendered with correct props
    const buyButton = within(container).getByTestId('book-card-buy-button')
    expect(buyButton).toBeInTheDocument()
    expect(buyButton).toHaveAttribute('data-edition-id', 'edition-1')
    expect(buyButton).toHaveAttribute('data-work-id', 'work-1')
  })
})
