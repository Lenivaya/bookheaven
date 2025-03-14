'use client'

import { useCallback } from 'react'
import { useQueryStates } from 'nuqs'
import { authorSearchParamsSchema } from '@/app/authors/searchParams'
import { Pagination } from '@/components/generic/pagination/Pagination'

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

  const handlePageChange = useCallback(
    (page: number) => {
      setSearchParams({ page: String(page) })
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
