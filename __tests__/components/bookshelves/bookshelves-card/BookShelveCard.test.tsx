import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { BookShelveCard } from '@/components/bookshelves/bookshelves-card/BookShelveCard'
import type { FetchedShelfRelations } from '@/app/actions/bookShelves.actions'
import type { Author, Tag, WorkToAuthor, WorkToTag } from '@/db/schema'

// Mock the child components
vi.mock('@/components/bookshelves/bookshelves-card/BookShelveUserInfo', () => ({
  BookShelveUserInfo: ({ userId }: any) => (
    <div data-testid='user-info'>User: {userId}</div>
  )
}))

vi.mock('@/components/bookshelves/bookshelves-card/ShelfEditButton', () => ({
  ShelfEditButton: ({ shelfId }: any) => (
    <div data-testid='edit-button'>Edit: {shelfId}</div>
  )
}))

vi.mock('@/components/bookshelves/bookshelves-card/ShelfDeleteButton', () => ({
  ShelfDeleteButton: ({ shelfId }: any) => (
    <div data-testid='delete-button'>Delete: {shelfId}</div>
  )
}))

vi.mock('@/components/bookshelves/bookshelves-card/ShelfLikeButton', () => ({
  ShelfLikeButton: ({ shelfId }: any) => (
    <div data-testid='like-button'>Like: {shelfId}</div>
  )
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt }: any) => (
    <img src={src} alt={alt} data-testid='book-thumbnail' />
  )
}))

// Mock next-view-transitions
vi.mock('next-view-transitions', () => ({
  Link: ({ href, children }: any) => <a href={href}>{children}</a>
}))

// Mock React.Suspense
vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    Suspense: ({ children }: { children: React.ReactNode }) => <>{children}</>
  }
})

describe('BookShelveCard', () => {
  const mockShelfWithBooks: FetchedShelfRelations = {
    id: 'shelf-1',
    userId: 'user-1',
    name: 'Test Shelf',
    description: 'Test Description',
    isPublic: true,
    likesCount: 0,
    created_at: new Date(),
    updated_at: null,
    deleted_at: null,
    items: [
      {
        shelfId: 'shelf-1',
        editionId: 'edition-1',
        notes: null,
        created_at: new Date(),
        updated_at: null,
        deleted_at: null,
        bookEdition: {
          id: 'edition-1',
          workId: 'work-1',
          isbn: '1234567890',
          publisher: 'Test Publisher',
          publishedAt: new Date(),
          price: '29.99',
          salePrice: null,
          isOnSale: false,
          coverUrl: 'https://example.com/cover1.jpg',
          thumbnailUrl: 'https://example.com/thumb1.jpg',
          smallThumbnailUrl: 'https://example.com/small-thumb1.jpg',
          created_at: new Date(),
          updated_at: null,
          deleted_at: null,
          likesCount: 0,
          work: {
            id: 'work-1',
            title: 'Book 1',
            description: 'Book 1 description',
            originalTitle: null,
            originalLanguage: 'en',
            writingCompletedAt: null,
            created_at: new Date(),
            updated_at: null,
            deleted_at: null,
            workToAuthors: [
              {
                workId: 'work-1',
                authorId: 'author-1',
                author: {
                  id: 'author-1',
                  name: 'Author 1',
                  biography: null,
                  birthDate: null,
                  deathDate: null,
                  photoUrl: null,
                  created_at: new Date(),
                  updated_at: null,
                  deleted_at: null
                }
              }
            ],
            workToTags: [
              {
                workId: 'work-1',
                tagId: 'tag-1',
                tag: {
                  id: 'tag-1',
                  name: 'Fiction',
                  description: null,
                  coverUrl: null,
                  created_at: new Date(),
                  updated_at: null,
                  deleted_at: null
                }
              }
            ]
          }
        }
      },
      {
        shelfId: 'shelf-1',
        editionId: 'edition-2',
        notes: null,
        created_at: new Date(),
        updated_at: null,
        deleted_at: null,
        bookEdition: {
          id: 'edition-2',
          workId: 'work-2',
          isbn: '0987654321',
          publisher: 'Test Publisher 2',
          publishedAt: new Date(),
          price: '19.99',
          salePrice: null,
          isOnSale: false,
          coverUrl: 'https://example.com/cover2.jpg',
          thumbnailUrl: 'https://example.com/thumb2.jpg',
          smallThumbnailUrl: 'https://example.com/small-thumb2.jpg',
          created_at: new Date(),
          updated_at: null,
          deleted_at: null,
          likesCount: 0,
          work: {
            id: 'work-2',
            title: 'Book 2',
            description: 'Book 2 description',
            originalTitle: null,
            originalLanguage: 'en',
            writingCompletedAt: null,
            created_at: new Date(),
            updated_at: null,
            deleted_at: null,
            workToAuthors: [
              {
                workId: 'work-2',
                authorId: 'author-2',
                author: {
                  id: 'author-2',
                  name: 'Author 2',
                  biography: null,
                  birthDate: null,
                  deathDate: null,
                  photoUrl: null,
                  created_at: new Date(),
                  updated_at: null,
                  deleted_at: null
                }
              }
            ],
            workToTags: [
              {
                workId: 'work-2',
                tagId: 'tag-2',
                tag: {
                  id: 'tag-2',
                  name: 'Fantasy',
                  description: null,
                  coverUrl: null,
                  created_at: new Date(),
                  updated_at: null,
                  deleted_at: null
                }
              }
            ]
          }
        }
      }
    ]
  }

  const mockEmptyShelf: FetchedShelfRelations = {
    ...mockShelfWithBooks,
    items: [],
    description: null
  }

  it('renders the shelf card with basic information', () => {
    render(<BookShelveCard shelf={mockShelfWithBooks} />)

    // Check if the title is rendered
    expect(screen.getByText('Test Shelf')).toBeInTheDocument()

    // Check if the description is rendered
    expect(screen.getByText('Test Description')).toBeInTheDocument()

    // Check if user info is rendered
    expect(screen.getByTestId('user-info')).toBeInTheDocument()

    // Check if action buttons are rendered
    expect(screen.getByTestId('edit-button')).toBeInTheDocument()
    expect(screen.getByTestId('delete-button')).toBeInTheDocument()
    expect(screen.getByTestId('like-button')).toBeInTheDocument()

    // Check if the link to view the shelf is rendered
    expect(screen.getByRole('link', { name: /view shelf/i })).toHaveAttribute(
      'href',
      `book-shelves/${mockShelfWithBooks.id}`
    )
  })

  it('renders book items with thumbnails and information', () => {
    const { container } = render(<BookShelveCard shelf={mockShelfWithBooks} />)

    // Get all book links
    const bookLinks = container.querySelectorAll('a[href^="/books/"]')
    expect(bookLinks).toHaveLength(2)

    // Check first book
    const firstBook = bookLinks[0] as HTMLElement
    expect(firstBook).toHaveAttribute('href', '/books/edition-1')
    const firstThumbnail = within(firstBook).getByTestId('book-thumbnail')
    expect(firstThumbnail).toHaveAttribute(
      'src',
      'https://example.com/thumb1.jpg'
    )
    expect(firstThumbnail).toHaveAttribute('alt', 'Book 1')

    // Check second book
    const secondBook = bookLinks[1] as HTMLElement
    expect(secondBook).toHaveAttribute('href', '/books/edition-2')
    const secondThumbnail = within(secondBook).getByTestId('book-thumbnail')
    expect(secondThumbnail).toHaveAttribute(
      'src',
      'https://example.com/thumb2.jpg'
    )
    expect(secondThumbnail).toHaveAttribute('alt', 'Book 2')

    // Check book titles are rendered (using getAllByText since titles might appear multiple times)
    const book1Titles = screen.getAllByText('Book 1')
    const book2Titles = screen.getAllByText('Book 2')
    expect(book1Titles.length).toBeGreaterThan(0)
    expect(book2Titles.length).toBeGreaterThan(0)

    // Check author names are rendered (using getAllByText since names might appear multiple times)
    const author1Names = screen.getAllByText('Author 1')
    const author2Names = screen.getAllByText('Author 2')
    expect(author1Names.length).toBeGreaterThan(0)
    expect(author2Names.length).toBeGreaterThan(0)
  })

  it('displays a message when the shelf has no books', () => {
    render(<BookShelveCard shelf={mockEmptyShelf} />)

    expect(screen.getByText('No books in this shelf')).toBeInTheDocument()
  })

  it('displays "No description provided" when description is null', () => {
    render(<BookShelveCard shelf={mockEmptyShelf} />)

    const descriptions = screen.getAllByText('No description provided')
    expect(descriptions[0]).toBeInTheDocument()
  })

  it('shows a "more books" indicator when there are more than 5 books', () => {
    const manyBooksShelf: FetchedShelfRelations = {
      ...mockShelfWithBooks,
      items: [
        ...mockShelfWithBooks.items,
        ...Array(4).fill(mockShelfWithBooks.items[0])
      ]
    }

    render(<BookShelveCard shelf={manyBooksShelf} />)

    // Check if the "more books" indicator is rendered
    expect(screen.getByText('+1 more')).toBeInTheDocument()
  })
})
