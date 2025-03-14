import { describe, it, expect, vi, afterEach, beforeAll } from 'vitest'
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor
} from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { BookShelvesForm } from '@/components/bookshelves/form/BookShelvesForm'

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock the necessary modules
vi.mock('@/app/actions/bookShelves.actions', () => ({
  upsertShelf: vi.fn(),
  updateShelf: vi.fn()
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn()
  })
}))

// Import mocked functions
import { upsertShelf, updateShelf } from '@/app/actions/bookShelves.actions'
import { toast } from 'sonner'

// Set up global mocks before all tests
beforeAll(() => {
  global.ResizeObserver = ResizeObserverMock
})

// Clean up after each test
afterEach(() => {
  cleanup()
  vi.resetAllMocks()
})

describe('BookShelvesForm', () => {
  it('renders form fields correctly', () => {
    render(<BookShelvesForm />)

    // Check if form elements are rendered
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Public Shelf')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Create Bookshelf' })
    ).toBeInTheDocument()
  })

  it('renders form with existing shelf data', () => {
    const mockShelf = {
      id: 'shelf-1',
      name: 'Test Shelf',
      description: 'Test Description',
      isPublic: true,
      items: []
    }

    render(<BookShelvesForm shelf={mockShelf} />)

    // Check if form fields are populated with shelf data
    expect(screen.getByLabelText('Name')).toHaveValue('Test Shelf')
    expect(screen.getByLabelText('Description')).toHaveValue('Test Description')
    expect(screen.getByLabelText('Public Shelf')).toBeChecked()
    expect(
      screen.getByRole('button', { name: 'Update Bookshelf' })
    ).toBeInTheDocument()
  })

  it('submits form with new shelf data', async () => {
    vi.mocked(upsertShelf).mockResolvedValue()

    render(<BookShelvesForm />)

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'New Shelf' }
    })
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'New Description' }
    })
    fireEvent.click(screen.getByLabelText('Public Shelf'))

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Create Bookshelf' }))

    // Wait for the async operations to complete
    await waitFor(() => {
      // Check if upsertShelf was called with correct data
      expect(upsertShelf).toHaveBeenCalledWith(
        {
          name: 'New Shelf',
          description: 'New Description',
          isPublic: true
        },
        []
      )

      // Check if success toast was shown
      expect(toast.success).toHaveBeenCalledWith(
        'Bookshelf created successfully!'
      )
    })
  })

  it('handles form submission error', async () => {
    vi.mocked(upsertShelf).mockRejectedValue(new Error('Submission failed'))

    render(<BookShelvesForm />)

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'New Shelf' }
    })

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Create Bookshelf' }))

    // Wait for the async operations to complete
    await waitFor(() => {
      // Check if error toast was shown
      expect(toast.error).toHaveBeenCalledWith(
        'Something went wrong. Please try again.'
      )
    })
  })
})
