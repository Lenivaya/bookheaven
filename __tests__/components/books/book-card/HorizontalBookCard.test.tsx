import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import HorizontalBookCard from '@/components/books/book-card/HorizontalBookCard'

// Mock the components used in HorizontalBookCard
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid='horizontal-book-card' className={className}>
      {children}
    </div>
  ),
  CardContent: ({ children, className }: any) => (
    <div data-testid='card-content' className={className}>
      {children}
    </div>
  ),
  CardFooter: ({ children, className }: any) => (
    <div data-testid='card-footer' className={className}>
      {children}
    </div>
  ),
  CardHeader: ({ children, className }: any) => (
    <div data-testid='card-header' className={className}>
      {children}
    </div>
  ),
  CardTitle: ({ children, className }: any) => (
    <div data-testid='card-title' className={className}>
      {children}
    </div>
  )
}))

vi.mock('next-view-transitions', () => ({
  Link: ({ children, href }: any) => (
    <a data-testid='link' href={href}>
      {children}
    </a>
  )
}))

vi.mock('@/components/books/book-card/BookCardAuthors', () => ({
  BookCardAuthors: ({ authors }: any) => (
    <div data-testid='book-authors'>
      {authors.map((author: any) => (
        <span key={author.id} data-author-id={author.id}>
          {author.name}
        </span>
      ))}
    </div>
  )
}))

vi.mock('@/components/books/book-card/ClientBookCover', () => ({
  ClientBookCover: ({ thumbnailUrl, title, editionId, isOnSale }: any) => (
    <div
      data-testid='book-cover'
      data-thumbnail={thumbnailUrl}
      data-title={title}
      data-edition-id={editionId}
      data-is-on-sale={isOnSale.toString()}
    />
  )
}))

vi.mock('@/components/books/book-card/ClientPriceAndBuy', () => ({
  ClientPriceAndBuy: ({
    price,
    salePrice,
    isOnSale,
    bookEdition,
    bookWork
  }: any) => (
    <div
      data-testid='price-and-buy'
      data-price={price}
      data-sale-price={salePrice}
      data-is-on-sale={isOnSale.toString()}
      data-edition-id={bookEdition.id}
      data-work-id={bookWork.id}
    />
  )
}))

// Clean up after each test to remove any elements from the DOM
afterEach(() => {
  cleanup()
})

describe('HorizontalBookCard', () => {
  const mockBook = {
    id: 'book-1',
    title: 'Test Book Title',
    description: 'This is a test book description',
    slug: 'test-book'
  }

  const mockEdition = {
    id: 'edition-1',
    thumbnailUrl: 'https://example.com/book.jpg',
    price: 19.99,
    salePrice: 14.99,
    isOnSale: true,
    format: 'Paperback'
  }

  const mockAuthors = [
    { id: 'author-1', name: 'Test Author 1' },
    { id: 'author-2', name: 'Test Author 2' }
  ]

  it('renders the book card with correct data', () => {
    const { container } = render(
      <HorizontalBookCard
        book={mockBook as any}
        edition={mockEdition as any}
        authors={mockAuthors as any}
      />
    )

    // Check if the card is rendered - use container.querySelector to get the first matching element
    const card = container.querySelector('[data-testid="horizontal-book-card"]')
    expect(card).toBeInTheDocument()

    // Check if the book title is rendered
    const title = container.querySelector('[data-testid="card-title"]')
    expect(title).toHaveTextContent(mockBook.title)

    // Check if the book cover is rendered with correct props
    const cover = container.querySelector('[data-testid="book-cover"]')
    expect(cover).toHaveAttribute('data-thumbnail', mockEdition.thumbnailUrl)
    expect(cover).toHaveAttribute('data-title', mockBook.title)
    expect(cover).toHaveAttribute('data-edition-id', mockEdition.id)
    expect(cover).toHaveAttribute('data-is-on-sale', 'true')

    // Check if the authors are rendered
    const authors = container.querySelector('[data-testid="book-authors"]')
    expect(authors).toBeInTheDocument()
    mockAuthors.forEach((author) => {
      const authorElement = authors?.querySelector(
        `[data-author-id="${author.id}"]`
      )
      expect(authorElement).toBeInTheDocument()
      expect(authorElement).toHaveTextContent(author.name)
    })

    // Check if the description is rendered
    expect(screen.getByText(mockBook.description)).toBeInTheDocument()

    // Check if the price and buy section is rendered with correct props
    const priceAndBuy = container.querySelector('[data-testid="price-and-buy"]')
    expect(priceAndBuy).toHaveAttribute(
      'data-price',
      mockEdition.price.toString()
    )
    expect(priceAndBuy).toHaveAttribute(
      'data-sale-price',
      mockEdition.salePrice.toString()
    )
    expect(priceAndBuy).toHaveAttribute('data-is-on-sale', 'true')
    expect(priceAndBuy).toHaveAttribute('data-edition-id', mockEdition.id)
    expect(priceAndBuy).toHaveAttribute('data-work-id', mockBook.id)

    // Check if the format is rendered
    expect(screen.getByText(mockEdition.format)).toBeInTheDocument()
  })

  it('applies width classes based on the width prop', () => {
    const { container, rerender } = render(
      <HorizontalBookCard
        book={mockBook as any}
        edition={mockEdition as any}
        authors={mockAuthors as any}
        width='xs'
      />
    )

    let card = container.querySelector('[data-testid="horizontal-book-card"]')
    expect(card).toHaveClass('w-[200px]')

    rerender(
      <HorizontalBookCard
        book={mockBook as any}
        edition={mockEdition as any}
        authors={mockAuthors as any}
        width='lg'
      />
    )

    card = container.querySelector('[data-testid="horizontal-book-card"]')
    expect(card).toHaveClass('w-[350px]')
  })

  it('applies custom className when provided', () => {
    const customClass = 'custom-test-class'
    const { container } = render(
      <HorizontalBookCard
        book={mockBook as any}
        edition={mockEdition as any}
        authors={mockAuthors as any}
        className={customClass}
      />
    )

    const card = container.querySelector('[data-testid="horizontal-book-card"]')
    expect(card).toHaveClass(customClass)
  })

  it('handles missing description gracefully', () => {
    const bookWithoutDescription = { ...mockBook, description: undefined }
    render(
      <HorizontalBookCard
        book={bookWithoutDescription as any}
        edition={mockEdition as any}
        authors={mockAuthors as any}
      />
    )

    // Description should not be rendered
    expect(screen.queryByText(mockBook.description)).not.toBeInTheDocument()
  })

  it('handles missing format gracefully', () => {
    const editionWithoutFormat = { ...mockEdition, format: undefined }
    render(
      <HorizontalBookCard
        book={mockBook as any}
        edition={editionWithoutFormat as any}
        authors={mockAuthors as any}
      />
    )

    // Format should not be rendered
    expect(screen.queryByText(mockEdition.format)).not.toBeInTheDocument()
  })
})
