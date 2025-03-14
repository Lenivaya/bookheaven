import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { BookPriceDisplay } from '@/components/books/book-card/BookPriceDisplay'

// Mock the Lucide icons
vi.mock('lucide-react', () => ({
  Tag: () => <div data-testid='tag-icon' />,
  TagsIcon: () => <div data-testid='tags-icon' />
}))

// We'll use the actual React implementation instead of mocking it
// This avoids issues with the hooks not working as expected

describe('BookPriceDisplay', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    // Mock setTimeout
    vi.spyOn(global, 'setTimeout').mockImplementation((() => 123) as any)

    // Mock clearTimeout
    vi.spyOn(global, 'clearTimeout').mockImplementation(vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders regular price when not on sale', () => {
    render(
      <div data-testid='regular-price-container'>
        <BookPriceDisplay price='29.99' salePrice={null} isOnSale={false} />
      </div>
    )

    // Get the test container to scope our queries
    const container = screen.getByTestId('regular-price-container')

    // Check if the regular price is displayed
    expect(container).toHaveTextContent('$29.99')

    // Check if the tags icon is displayed
    expect(within(container).getByTestId('tags-icon')).toBeInTheDocument()

    // Check that the sale price elements are not rendered
    expect(within(container).queryByTestId('tag-icon')).not.toBeInTheDocument()
  })

  it('renders sale price and original price when on sale', () => {
    render(
      <div data-testid='sale-price-container'>
        <BookPriceDisplay price='29.99' salePrice='19.99' isOnSale={true} />
      </div>
    )

    // Get the test container to scope our queries
    const container = screen.getByTestId('sale-price-container')

    // Check if the sale price is displayed
    expect(container).toHaveTextContent('$19.99')

    // Check if the original price is displayed
    expect(container).toHaveTextContent('$29.99')

    // Check if the tag icon is displayed
    expect(within(container).getByTestId('tag-icon')).toBeInTheDocument()
  })

  it('sets up a timeout when on sale', () => {
    render(
      <div data-testid='timeout-container'>
        <BookPriceDisplay price='29.99' salePrice='19.99' isOnSale={true} />
      </div>
    )

    // Check if setTimeout was called
    expect(setTimeout).toHaveBeenCalled()
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 2000)
  })

  it('does not set up a timeout when not on sale', () => {
    render(
      <div data-testid='no-timeout-container'>
        <BookPriceDisplay price='29.99' salePrice={null} isOnSale={false} />
      </div>
    )

    // Check that setTimeout was not called
    expect(setTimeout).not.toHaveBeenCalled()
  })
})
