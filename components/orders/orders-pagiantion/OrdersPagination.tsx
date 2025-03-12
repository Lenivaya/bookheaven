'use client'

import { useCallback } from 'react'
import { useQueryStates } from 'nuqs'
import { orderSearchParamsSchema } from '@/app/user/dashboard/orders/searchParams'
import { Pagination } from '@/components/generic/pagination/Pagination'

interface OrdersPaginationProps {
  currentPage: number
  pageCount: number
  totalCount: number
  pageSize: number
}

export function OrdersPagination({
  currentPage,
  pageCount,
  totalCount,
  pageSize
}: OrdersPaginationProps) {
  const [, setSearchParams] = useQueryStates(orderSearchParamsSchema, {
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
