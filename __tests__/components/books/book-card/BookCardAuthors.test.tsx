import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { BookCardAuthors } from '@/components/books/book-card/BookCardAuthors'

// Mock the ClientAuthorsInteraction component
vi.mock('@/components/books/book-card/ClientAuthorsInteraction', () => ({
  ClientAuthorsInteraction: ({ authors }: any) => (
    <div data-testid='client-authors-interaction'>
      {authors.map((author: any) => (
        <span key={author.id} data-testid='author-name'>
          {author.name}
        </span>
      ))}
    </div>
  )
}))

describe('BookCardAuthors', () => {
  it('renders the ClientAuthorsInteraction component with authors', () => {
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

    render(<BookCardAuthors authors={mockAuthors as any} />)

    // Check if the ClientAuthorsInteraction component is rendered
    const clientAuthorsInteraction = screen.getByTestId(
      'client-authors-interaction'
    )
    expect(clientAuthorsInteraction).toBeInTheDocument()

    // Check if all authors are passed to the ClientAuthorsInteraction component
    const authorNames = screen.getAllByTestId('author-name')
    expect(authorNames).toHaveLength(2)
    expect(authorNames[0]).toHaveTextContent('Test Author 1')
    expect(authorNames[1]).toHaveTextContent('Test Author 2')
  })
})
