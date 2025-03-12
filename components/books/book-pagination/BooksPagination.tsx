'use client'

import { useCallback } from 'react'
import { useQueryStates } from 'nuqs'
import { bookSearchParamsSchema } from '@/app/books/searchParams'
import { Pagination } from '@/components/generic/pagination/Pagination'

interface BooksPaginationProps {
  currentPage: number
  pageCount: number
  totalCount: number
  pageSize: number
}

export function BooksPagination({
  currentPage,
  pageCount,
  totalCount,
  pageSize
}: BooksPaginationProps) {
  const [, setSearchParams] = useQueryStates(bookSearchParamsSchema, {
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
