'use client'

import { Pagination } from '@/components/generic/pagination/Pagination'
import { useQueryStates } from 'nuqs'
import { useCallback } from 'react'
import { bookShelvesSearchParamsSchema } from './bookshelves-search/shelves.searchParams'

interface BookShelvesPaginationProps {
  currentPage: number
  pageCount: number
  totalCount: number
  pageSize: number
}

export function BookShelvesPagination({
  currentPage,
  pageCount,
  totalCount,
  pageSize
}: BookShelvesPaginationProps) {
  const [, setSearchParams] = useQueryStates(bookShelvesSearchParamsSchema, {
    shallow: false
  })

  const handlePageChange = useCallback(
    (page: number) => {
      setSearchParams({ page: String(page) })
    },
    [setSearchParams]
  )

  return (
    <Pagination
      meta={{
        page: currentPage,
        limit: pageSize,
        total: totalCount,
        pageCount
      }}
      onPageChange={handlePageChange}
      showPageSize={false}
    />
  )
}
