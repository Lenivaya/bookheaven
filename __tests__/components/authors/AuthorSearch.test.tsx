import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
  act
} from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import React from 'react'

// Import the component
import AuthorSearch from '@/components/authors/author-search/AuthorSearch'
import { Author } from '@/db/schema'

// Mock the AuthorList component
const mockAuthorList = vi
  .fn()
  .mockImplementation(
    ({
      authors,
      followedAuthorIds
    }: {
      authors: Author[]
      followedAuthorIds?: string[]
    }) => (
      <div data-testid='author-list'>
        {authors.map((author: Author) => (
          <div key={author.id} data-testid={`author-${author.id}`}>
            {author.name}
          </div>
        ))}
      </div>
    )
  )

vi.mock('@/components/authors/author-list/AuthorList', () => ({
  __esModule: true,
  default: (props: { authors: Author[]; followedAuthorIds?: string[] }) =>
    mockAuthorList(props)
}))

// Mock data for testing
const mockAuthors: Author[] = [
  {
    id: 'author1',
    name: 'J.K. Rowling',
    biography: 'Author of Harry Potter series',
    photoUrl: '/images/authors/jk-rowling.jpg',
    birthDate: null,
    deathDate: null,
    created_at: new Date(),
    updated_at: null,
    deleted_at: null
  },
  {
    id: 'author2',
    name: 'George R.R. Martin',
    biography: 'Author of A Song of Ice and Fire series',
    photoUrl: '/images/authors/george-rr-martin.jpg',
    birthDate: null,
    deathDate: null,
    created_at: new Date(),
    updated_at: null,
    deleted_at: null
  },
  {
    id: 'author3',
    name: 'Stephen King',
    biography: 'Master of horror fiction',
    photoUrl: '/images/authors/stephen-king.jpg',
    birthDate: null,
    deathDate: null,
    created_at: new Date(),
    updated_at: null,
    deleted_at: null
  }
]

describe('AuthorSearch', () => {
  // Set up before each test
  beforeEach(() => {
    mockAuthorList.mockClear()
  })

  // Clean up after each test
  afterEach(() => {
    cleanup()
    vi.resetAllMocks()
  })

  it('renders the search input and button correctly', () => {
    render(<AuthorSearch initialAuthors={mockAuthors} />)

    // Check if the search input is rendered
    const searchInput = screen.getByPlaceholderText(
      'Search authors by name or biography...'
    )
    expect(searchInput).toBeInTheDocument()

    // Check if the search button is rendered
    const searchButton = screen.getByText('Search')
    expect(searchButton).toBeInTheDocument()

    // Check if the search icon is rendered
    expect(document.querySelector('svg')).toBeInTheDocument()
  })

  it('displays all initial authors when first rendered', () => {
    render(<AuthorSearch initialAuthors={mockAuthors} />)

    // Check if AuthorList was called with the initial authors
    expect(mockAuthorList).toHaveBeenCalledWith(
      expect.objectContaining({
        authors: mockAuthors,
        followedAuthorIds: []
      })
    )
  })

  it('updates search query on input change', async () => {
    render(<AuthorSearch initialAuthors={mockAuthors} />)

    // Get the search input
    const searchInput = screen.getByPlaceholderText(
      'Search authors by name or biography...'
    )

    // Type in the search input
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'rowling' } })
    })

    // Verify the input value was updated
    expect(searchInput).toHaveValue('rowling')
  })

  it('filters authors when search form is submitted', async () => {
    // Mock the setTimeout function
    vi.useFakeTimers()

    render(<AuthorSearch initialAuthors={mockAuthors} />)

    // Get the search input and button
    const searchInput = screen.getByPlaceholderText(
      'Search authors by name or biography...'
    )
    const searchButton = screen.getByText('Search')

    // Type in the search input
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'rowling' } })
    })

    // Submit the form
    await act(async () => {
      fireEvent.click(searchButton)
    })

    // Fast-forward timers to simulate the API delay
    await act(async () => {
      vi.advanceTimersByTime(500)
    })

    // Check if AuthorList was called with the filtered authors
    expect(mockAuthorList).toHaveBeenLastCalledWith(
      expect.objectContaining({
        authors: expect.arrayContaining([
          expect.objectContaining({
            id: 'author1',
            name: 'J.K. Rowling'
          })
        ]),
        followedAuthorIds: []
      })
    )

    // Check that the filtered authors don't include the other authors
    const lastCallAuthors =
      mockAuthorList.mock.calls[mockAuthorList.mock.calls.length - 1][0].authors
    expect(lastCallAuthors.length).toBe(1)
    expect(lastCallAuthors[0].id).toBe('author1')

    // Restore real timers
    vi.useRealTimers()
  })

  it('filters authors by biography when search form is submitted', async () => {
    // Mock the setTimeout function
    vi.useFakeTimers()

    render(<AuthorSearch initialAuthors={mockAuthors} />)

    // Get the search input and button
    const searchInput = screen.getByPlaceholderText(
      'Search authors by name or biography...'
    )
    const searchButton = screen.getByText('Search')

    // Type in the search input
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'horror' } })
    })

    // Submit the form
    await act(async () => {
      fireEvent.click(searchButton)
    })

    // Fast-forward timers to simulate the API delay
    await act(async () => {
      vi.advanceTimersByTime(500)
    })

    // Check if AuthorList was called with the filtered authors
    expect(mockAuthorList).toHaveBeenLastCalledWith(
      expect.objectContaining({
        authors: expect.arrayContaining([
          expect.objectContaining({
            id: 'author3',
            name: 'Stephen King'
          })
        ]),
        followedAuthorIds: []
      })
    )

    // Check that the filtered authors don't include the other authors
    const lastCallAuthors =
      mockAuthorList.mock.calls[mockAuthorList.mock.calls.length - 1][0].authors
    expect(lastCallAuthors.length).toBe(1)
    expect(lastCallAuthors[0].id).toBe('author3')

    // Restore real timers
    vi.useRealTimers()
  })

  it('shows all authors when search query is empty', async () => {
    // Mock the setTimeout function
    vi.useFakeTimers()

    render(<AuthorSearch initialAuthors={mockAuthors} />)

    // Get the search input and button
    const searchInput = screen.getByPlaceholderText(
      'Search authors by name or biography...'
    )
    const searchButton = screen.getByText('Search')

    // Type in the search input and then clear it
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'rowling' } })
    })

    // Submit the form with a non-empty query
    await act(async () => {
      fireEvent.click(searchButton)
    })

    // Fast-forward timers
    await act(async () => {
      vi.advanceTimersByTime(500)
    })

    // Clear the search input
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: '' } })
    })

    // Submit the form with an empty query
    await act(async () => {
      fireEvent.click(searchButton)
    })

    // Check if AuthorList was called with all the initial authors
    expect(mockAuthorList).toHaveBeenLastCalledWith(
      expect.objectContaining({
        authors: mockAuthors,
        followedAuthorIds: []
      })
    )

    // Restore real timers
    vi.useRealTimers()
  })

  it('displays loading state during search', async () => {
    // Mock the setTimeout function
    vi.useFakeTimers()

    render(<AuthorSearch initialAuthors={mockAuthors} />)

    // Get the search input and button
    const searchInput = screen.getByPlaceholderText(
      'Search authors by name or biography...'
    )
    const searchButton = screen.getByText('Search')

    // Type in the search input
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'rowling' } })
    })

    // Submit the form
    await act(async () => {
      fireEvent.click(searchButton)
    })

    // Check if the button is disabled during loading
    expect(searchButton).toBeDisabled()

    // Fast-forward timers to complete the loading
    await act(async () => {
      vi.advanceTimersByTime(500)
    })

    // Check if the button is enabled after loading
    expect(searchButton).not.toBeDisabled()

    // Restore real timers
    vi.useRealTimers()
  })

  it('renders with followed author IDs', () => {
    const followedAuthorIds = ['author1', 'author3']
    render(
      <AuthorSearch
        initialAuthors={mockAuthors}
        followedAuthorIds={followedAuthorIds}
      />
    )

    // Check if AuthorList was called with the followedAuthorIds
    expect(mockAuthorList).toHaveBeenCalledWith(
      expect.objectContaining({
        authors: mockAuthors,
        followedAuthorIds: followedAuthorIds
      })
    )
  })
})
