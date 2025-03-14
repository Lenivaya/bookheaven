import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import HorizontalBookCard from '@/components/books/book-card/HorizontalBookCard'

// Clean up after each test
afterEach(() => {
  cleanup()
})

// Mock the child components to avoid testing their implementation
vi.mock('@/components/books/book-card/BookCardAuthors', () => ({
  BookCardAuthors: ({ authors }: any) => (
    <div data-testid='book-card-authors'>
      {authors.map((author: any) => (
        <span key={author.id} data-testid='author-name'>
          {author.name}
        </span>
      ))}
    </div>
  )
}))

vi.mock('@/components/books/book-card/ClientBookCover', () => ({
  ClientBookCover: ({ thumbnailUrl, title, editionId, isOnSale }: any) => (
    <div
      data-testid='client-book-cover'
      data-thumbnail={thumbnailUrl}
      data-title={title}
      data-edition-id={editionId}
      data-is-on-sale={isOnSale.toString()}
    />
  )
}))

vi.mock('@/components/books/book-card/ClientPriceAndBuy', () => ({
  ClientPriceAndBuy: ({ price, salePrice, isOnSale }: any) => (
    <div
      data-testid='client-price-and-buy'
      data-price={price}
      data-sale-price={salePrice || ''}
      data-is-on-sale={isOnSale.toString()}
    />
  )
}))

vi.mock('next-view-transitions', () => ({
  Link: ({ href, children }: any) => (
    <a href={href} data-testid='next-link'>
      {children}
    </a>
  )
}))

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid='card' className={className}>
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

// Mock the utils
vi.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' ')
}))

// Mock the types to match the schema
vi.mock('@/db/schema', () => {
  return {
    // These are just for type checking, not actual implementations
    Author: vi.fn(),
    BookEdition: vi.fn(),
    BookWork: vi.fn(),
    Tag: vi.fn()
  }
})

describe('HorizontalBookCard', () => {
  // Create mock data that matches the expected schema
  const mockBook = {
    id: '1',
    title: 'Test Book Title',
    description:
      'This is a test book description that should be displayed in the card.',
    originalTitle: null,
    writingCompletedAt: null,
    originalLanguage: null,
    created_at: new Date(),
    updated_at: null,
    deleted_at: null
  }

  const mockEdition = {
    id: 'edition-1',
    workId: '1',
    isbn: '1234567890123',
    format: 'Paperback',
    price: '19.99',
    salePrice: '14.99',
    isOnSale: true,
    thumbnailUrl: '/images/test-book.jpg',
    pageCount: 300,
    publicationDate: new Date(),
    created_at: new Date(),
    updated_at: null,
    deleted_at: null,
    publisher: null,
    language: null,
    translatedFrom: null,
    translatedBy: null,
    coverDesigner: null,
    illustrator: null,
    likesCount: 0
  }

  const mockAuthors = [
    {
      id: 'author-1',
      name: 'Test Author 1',
      biography: 'Test biography 1',
      birthDate: null,
      deathDate: null,
      photoUrl: null,
      created_at: new Date(),
      updated_at: null,
      deleted_at: null
    },
    {
      id: 'author-2',
      name: 'Test Author 2',
      biography: 'Test biography 2',
      birthDate: null,
      deathDate: null,
      photoUrl: null,
      created_at: new Date(),
      updated_at: null,
      deleted_at: null
    }
  ]

  it('renders the horizontal book card with all information', () => {
    render(
      <HorizontalBookCard
        book={mockBook as any}
        edition={mockEdition as any}
        authors={mockAuthors as any}
      />
    )

    // Check if the card is rendered
    const card = screen.getByTestId('card')
    expect(card).toBeInTheDocument()
    expect(card).toHaveClass('w-[300px]') // Default width is 'md'

    // Check if the book cover is rendered with correct props
    const bookCover = screen.getByTestId('client-book-cover')
    expect(bookCover).toBeInTheDocument()
    expect(bookCover).toHaveAttribute(
      'data-thumbnail',
      mockEdition.thumbnailUrl
    )
    expect(bookCover).toHaveAttribute('data-title', mockBook.title)
    expect(bookCover).toHaveAttribute('data-edition-id', mockEdition.id)
    expect(bookCover).toHaveAttribute('data-is-on-sale', 'true')

    // Check if the book title is rendered
    const cardTitle = screen.getByTestId('card-title')
    expect(cardTitle).toHaveTextContent(mockBook.title)

    // Check if the authors are rendered
    const authors = screen.getByTestId('book-card-authors')
    expect(authors).toBeInTheDocument()
    const authorNames = screen.getAllByTestId('author-name')
    expect(authorNames).toHaveLength(2)
    expect(authorNames[0]).toHaveTextContent(mockAuthors[0].name)
    expect(authorNames[1]).toHaveTextContent(mockAuthors[1].name)

    // Check if the description is rendered
    const cardContent = screen.getByTestId('card-content')
    expect(cardContent).toHaveTextContent(mockBook.description as string)

    // Check if the price and buy section is rendered
    const priceAndBuy = screen.getByTestId('client-price-and-buy')
    expect(priceAndBuy).toBeInTheDocument()
    expect(priceAndBuy).toHaveAttribute('data-price', mockEdition.price)
    expect(priceAndBuy).toHaveAttribute(
      'data-sale-price',
      mockEdition.salePrice
    )
    expect(priceAndBuy).toHaveAttribute('data-is-on-sale', 'true')

    // Check if the format is rendered
    const cardFooter = screen.getByTestId('card-footer')
    expect(cardFooter).toHaveTextContent(mockEdition.format as string)
  })

  it('applies different width classes based on the width prop', () => {
    const widths = ['xs', 'sm', 'md', 'lg', 'xl'] as const
    const widthClasses = {
      xs: 'w-[200px]',
      sm: 'w-[250px]',
      md: 'w-[300px]',
      lg: 'w-[350px]',
      xl: 'w-[400px]'
    }

    // Test each width option separately
    widths.forEach((width) => {
      // Clean up before each render
      cleanup()

      const { container } = render(
        <HorizontalBookCard
          book={mockBook as any}
          edition={mockEdition as any}
          authors={mockAuthors as any}
          width={width}
          // Add a unique data attribute to identify this specific render
          className={`test-width-${width}`}
        />
      )

      // Find the card element with the specific class we added
      const card = container.querySelector(`.test-width-${width}`)
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass(widthClasses[width])
    })
  })

  it('applies additional className when provided', () => {
    const customClass = 'custom-test-class'

    render(
      <HorizontalBookCard
        book={mockBook as any}
        edition={mockEdition as any}
        authors={mockAuthors as any}
        className={customClass}
      />
    )

    const card = screen.getByTestId('card')
    expect(card).toHaveClass(customClass)
    expect(card).toHaveClass('w-[300px]') // Default width class should still be applied
  })
})
