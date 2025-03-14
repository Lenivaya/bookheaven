import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, within } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { BookTagsList } from '@/components/books/book-card/BookTagsList'

// Mock the Lucide icon
vi.mock('lucide-react', () => ({
  TagIcon: () => <div data-testid='tag-icon' />
}))

// Mock the ClientTagsInteraction component
vi.mock('@/components/books/book-card/ClientTagsInteraction', () => ({
  ClientTagsInteraction: ({ tags }: any) => (
    <div data-testid='client-tags-interaction'>
      {tags.map((tag: any) => (
        <span
          key={tag.id}
          data-testid='tag-item'
          data-tag-name={tag.displayName}
          data-color-class={tag.colorClass}
        >
          {tag.displayName}
        </span>
      ))}
    </div>
  )
}))

// Clean up after each test to remove any elements from the DOM
afterEach(() => {
  cleanup()
})

describe('BookTagsList', () => {
  it('renders "No tags" message when tags array is empty', () => {
    render(
      <div data-testid='empty-tags-container'>
        <BookTagsList tags={[]} />
      </div>
    )

    // Get the test container to scope our queries
    const container = screen.getByTestId('empty-tags-container')

    // Check if the tag icon is rendered
    expect(within(container).getByTestId('tag-icon')).toBeInTheDocument()

    // Check if the "No tags" text is rendered
    expect(within(container).getByText('No tags')).toBeInTheDocument()

    // Check that the ClientTagsInteraction is not rendered
    expect(
      within(container).queryByTestId('client-tags-interaction')
    ).not.toBeInTheDocument()
  })

  it('renders ClientTagsInteraction with tags when tags array is not empty', () => {
    const mockTags = [
      {
        id: 'tag-1',
        name: 'Fiction',
        description: null,
        coverUrl: null,
        created_at: new Date(),
        updated_at: null,
        deleted_at: null
      },
      {
        id: 'tag-2',
        name: 'Fantasy',
        description: null,
        coverUrl: null,
        created_at: new Date(),
        updated_at: null,
        deleted_at: null
      }
    ]

    render(
      <div data-testid='with-tags-container'>
        <BookTagsList tags={mockTags as any} />
      </div>
    )

    // Get the test container to scope our queries
    const container = screen.getByTestId('with-tags-container')

    // Check if the ClientTagsInteraction component is rendered
    expect(
      within(container).getByTestId('client-tags-interaction')
    ).toBeInTheDocument()

    // Check if all tags are passed to the ClientTagsInteraction component
    const tagItems = within(container).getAllByTestId('tag-item')
    expect(tagItems).toHaveLength(2)
    expect(tagItems[0]).toHaveTextContent('Fiction')
    expect(tagItems[1]).toHaveTextContent('Fantasy')

    // Check that each tag has a color class assigned
    tagItems.forEach((tag) => {
      expect(tag).toHaveAttribute('data-color-class')
    })
  })

  it('truncates long tag names', () => {
    const mockTags = [
      {
        id: 'tag-1',
        name: 'This is a very long tag name that should be truncated',
        description: null,
        coverUrl: null,
        created_at: new Date(),
        updated_at: null,
        deleted_at: null
      }
    ]

    render(
      <div data-testid='truncate-tags-container'>
        <BookTagsList tags={mockTags as any} />
      </div>
    )

    // Get the test container to scope our queries
    const container = screen.getByTestId('truncate-tags-container')

    // Check if the tag name is truncated
    const tagItem = within(container).getByTestId('tag-item')
    expect(tagItem).toHaveAttribute('data-tag-name', 'This is a very…')
  })
})
