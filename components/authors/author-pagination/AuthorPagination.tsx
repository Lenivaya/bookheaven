'use client'

import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'
import { useQueryStates } from 'nuqs'
import { authorSearchParamsSchema } from '@/app/authors/searchParams'

interface AuthorPaginationProps {
  currentPage: number
  pageCount: number
  totalCount: number
  pageSize: number
}

export function AuthorPagination({
  currentPage,
  pageCount,
  totalCount,
  pageSize
}: AuthorPaginationProps) {
  const [, setSearchParams] = useQueryStates(authorSearchParamsSchema, {
    shallow: false
  })

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() })
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Calculate the range of items being displayed
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalCount)

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []

    // Always show first page
    if (currentPage > 3) {
      pages.push(1)
      // Add ellipsis if there's a gap
      if (currentPage > 4) {
        pages.push('ellipsis')
      }
    }

    // Calculate range around current page
    const start = Math.max(1, currentPage - 1)
    const end = Math.min(pageCount, currentPage + 1)

    // Add pages around current page
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Always show last page
    if (currentPage < pageCount - 2) {
      // Add ellipsis if there's a gap
      if (currentPage < pageCount - 3) {
        pages.push('ellipsis')
      }
      pages.push(pageCount)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className='flex flex-col items-center space-y-2 py-4'>
      <div className='flex items-center space-x-2'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          aria-label='First page'
        >
          <ChevronsLeft className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          size='icon'
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label='Previous page'
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>

        {pageNumbers.map((page, i) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${i}`} className='px-2'>
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size='icon'
              onClick={() => handlePageChange(page as number)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant='outline'
          size='icon'
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pageCount}
          aria-label='Next page'
        >
          <ChevronRight className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          size='icon'
          onClick={() => handlePageChange(pageCount)}
          disabled={currentPage === pageCount}
          aria-label='Last page'
        >
          <ChevronsRight className='h-4 w-4' />
        </Button>
      </div>

      <div className='text-sm text-muted-foreground'>
        Showing {startItem}-{endItem} of {totalCount} authors
      </div>
    </div>
  )
}
