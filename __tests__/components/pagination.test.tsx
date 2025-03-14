import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import {
  Pagination,
  type PaginationMeta
} from '@/components/generic/pagination/Pagination'
import { PaginationInfo } from '@/components/generic/pagination/PaginationInfo'

// Clean up after each test to prevent DOM pollution
afterEach(() => {
  cleanup()
})

describe('PaginationInfo', () => {
  it('should display "No results found" when total is 0', () => {
    const meta: PaginationMeta = {
      page: 1,
      limit: 10,
      total: 0,
      pageCount: 1
    }

    const { container } = render(
      <PaginationInfo meta={meta} data-testid='pagination-info' />
    )
    expect(container.textContent).toContain('No results found')
  })

  it('should display "Showing 1 of 1 results" when there is only one result', () => {
    const meta: PaginationMeta = {
      page: 1,
      limit: 10,
      total: 1,
      pageCount: 1
    }

    const { container } = render(
      <PaginationInfo meta={meta} data-testid='pagination-info' />
    )
    expect(container.textContent).toContain('Showing 1 of 1 results')
  })

  it('should display correct range for multiple results', () => {
    const meta: PaginationMeta = {
      page: 2,
      limit: 10,
      total: 25,
      pageCount: 3
    }

    const { container } = render(
      <PaginationInfo meta={meta} data-testid='pagination-info' />
    )
    expect(container.textContent).toContain('Showing 11 to 20 of 25 results')
  })

  it('should use custom results label when provided', () => {
    const meta: PaginationMeta = {
      page: 1,
      limit: 10,
      total: 25,
      pageCount: 3
    }

    const { container } = render(
      <PaginationInfo
        meta={meta}
        resultsLabel='books'
        data-testid='pagination-info'
      />
    )
    expect(container.textContent).toContain('Showing 1 to 10 of 25 books')
  })

  it('should apply custom className when provided', () => {
    const meta: PaginationMeta = {
      page: 1,
      limit: 10,
      total: 25,
      pageCount: 3
    }

    const { container } = render(
      <PaginationInfo
        meta={meta}
        className='custom-class'
        data-testid='pagination-info'
      />
    )
    const element = container.firstChild as HTMLElement
    expect(element.className).toContain('custom-class')
  })
})

describe('Pagination', () => {
  it('should not render pagination controls when total is 0', () => {
    const meta: PaginationMeta = {
      page: 1,
      limit: 10,
      total: 0,
      pageCount: 1
    }
    const onPageChange = vi.fn()

    const { container } = render(
      <Pagination meta={meta} onPageChange={onPageChange} />
    )

    // Should only show the info component
    expect(container.textContent).toContain('No results found')
    expect(
      container.querySelector('[aria-label="Go to first page"]')
    ).not.toBeInTheDocument()
  })

  it('should not render info when showInfo is false', () => {
    const meta: PaginationMeta = {
      page: 1,
      limit: 10,
      total: 0,
      pageCount: 1
    }
    const onPageChange = vi.fn()

    const { container } = render(
      <Pagination meta={meta} onPageChange={onPageChange} showInfo={false} />
    )

    // Should not render anything
    expect(container.textContent).toBe('')
  })

  it('should render pagination controls when there are results', () => {
    const meta: PaginationMeta = {
      page: 2,
      limit: 10,
      total: 25,
      pageCount: 3
    }
    const onPageChange = vi.fn()

    const { container } = render(
      <Pagination meta={meta} onPageChange={onPageChange} />
    )

    // Navigation controls
    expect(
      container.querySelector('[aria-label="Go to first page"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[aria-label="Go to previous page"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[aria-label="Go to next page"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[aria-label="Go to last page"]')
    ).toBeInTheDocument()

    // Page info
    expect(container.textContent).toContain('Page 2')
    expect(container.textContent).toContain('of 3')

    // Results info
    expect(container.textContent).toContain('Showing 11 to 20 of 25 results')
  })

  it('should call onPageChange with correct page numbers', () => {
    const meta: PaginationMeta = {
      page: 2,
      limit: 10,
      total: 25,
      pageCount: 3
    }
    const onPageChange = vi.fn()

    const { container } = render(
      <Pagination meta={meta} onPageChange={onPageChange} />
    )

    // Click first page button
    fireEvent.click(container.querySelector('[aria-label="Go to first page"]')!)
    expect(onPageChange).toHaveBeenCalledWith(1)
    onPageChange.mockReset()

    // Click previous page button
    fireEvent.click(
      container.querySelector('[aria-label="Go to previous page"]')!
    )
    expect(onPageChange).toHaveBeenCalledWith(1)
    onPageChange.mockReset()

    // Click next page button
    fireEvent.click(container.querySelector('[aria-label="Go to next page"]')!)
    expect(onPageChange).toHaveBeenCalledWith(3)
    onPageChange.mockReset()

    // Click last page button
    fireEvent.click(container.querySelector('[aria-label="Go to last page"]')!)
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('should render page size selector when showPageSize is true', () => {
    const meta: PaginationMeta = {
      page: 1,
      limit: 10,
      total: 25,
      pageCount: 3
    }
    const onPageChange = vi.fn()
    const onLimitChange = vi.fn()

    const { container } = render(
      <Pagination
        meta={meta}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
        showPageSize={true}
      />
    )

    expect(container.textContent).toContain('Show')
    expect(container.textContent).toContain('per page')

    // Check that the current limit is displayed
    const selectTrigger = container.querySelector('[role="combobox"]')
    expect(selectTrigger?.textContent).toContain('10')
  })

  it('should not render page size selector when showPageSize is false', () => {
    const meta: PaginationMeta = {
      page: 1,
      limit: 10,
      total: 25,
      pageCount: 3
    }
    const onPageChange = vi.fn()
    const onLimitChange = vi.fn()

    const { container } = render(
      <Pagination
        meta={meta}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
        showPageSize={false}
      />
    )

    // Should not contain the page size selector text
    const content = container.textContent || ''
    expect(content.includes('Show') && content.includes('per page')).toBe(false)
  })

  it('should use custom labels when provided', () => {
    const meta: PaginationMeta = {
      page: 1,
      limit: 10,
      total: 25,
      pageCount: 3
    }
    const onPageChange = vi.fn()
    const onLimitChange = vi.fn()

    const { container } = render(
      <Pagination
        meta={meta}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
        labels={{
          show: 'Display',
          perPage: 'items per page',
          results: 'books',
          page: 'Página',
          of: 'de'
        }}
      />
    )

    const content = container.textContent || ''
    expect(content).toContain('Display')
    expect(content).toContain('items per page')
    expect(content).toContain('Showing 1 to 10 of 25 books')
    expect(content).toContain('Página 1')
    expect(content).toContain('de 3')
  })

  it('should normalize meta data to handle edge cases', () => {
    // Test with invalid meta values but with a positive total so we can see the pagination
    const meta: PaginationMeta = {
      page: -1, // Invalid page
      limit: 0, // Invalid limit
      total: 5, // Positive total to ensure pagination renders
      pageCount: 0 // Invalid pageCount
    }
    const onPageChange = vi.fn()

    const { container } = render(
      <Pagination meta={meta} onPageChange={onPageChange} />
    )

    // Should normalize to page 1, limit 1, total 5, pageCount 5
    const content = container.textContent || ''
    expect(content).toContain('Page 1')
    expect(content).toContain('of 5')

    // Test with zero total
    const zeroTotalMeta: PaginationMeta = {
      page: -1,
      limit: 0,
      total: 0,
      pageCount: 0
    }

    cleanup() // Clean up previous render

    const { container: zeroContainer } = render(
      <Pagination meta={zeroTotalMeta} onPageChange={onPageChange} />
    )

    // Should only show "No results found" when total is 0
    expect(zeroContainer.textContent).toContain('No results found')
    expect(zeroContainer.textContent).not.toContain('Page 1')
  })

  it('should apply custom styles when provided', () => {
    const meta: PaginationMeta = {
      page: 1,
      limit: 10,
      total: 25,
      pageCount: 3
    }
    const onPageChange = vi.fn()

    const { container } = render(
      <Pagination
        meta={meta}
        onPageChange={onPageChange}
        styles={{
          container: 'custom-container',
          navigation: 'custom-navigation',
          info: 'custom-info'
        }}
      />
    )

    // Check that custom classes are applied
    expect(container.firstChild).toHaveClass('custom-container')
  })
})
