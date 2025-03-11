'use client'

import { useCallback } from 'react'
import { useQueryStates } from 'nuqs'
import { reviewSearchParamsSchema } from '@/app/user/dashboard/reviews/searchParams'
import { Pagination } from '@/components/generic/pagination/Pagination'

interface ReviewsPaginationProps {
  currentPage: number
  pageCount: number
  totalCount: number
  pageSize: number
}

export function ReviewsPagination({
  currentPage,
  pageCount,
  totalCount,
  pageSize
}: ReviewsPaginationProps) {
  const [, setSearchParams] = useQueryStates(reviewSearchParamsSchema, {
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
    />
  )
}
