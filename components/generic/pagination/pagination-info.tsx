import { cn } from '@/lib/utils'
import type { PaginationMeta } from './pagination'

export interface PaginationInfoProps {
  /**
   * Current pagination meta information
   */
  meta: PaginationMeta
  /**
   * Custom className for the container
   */
  className?: string
  /**
   * Custom text for "results" label
   * @default "results"
   */
  resultsLabel?: string
}

interface PaginationRange {
  start: number
  end: number
  total: number
}

function calculateRange(meta: PaginationMeta): PaginationRange {
  const { page, limit, total } = meta

  // Handle edge cases
  if (total === 0) {
    return { start: 0, end: 0, total: 0 }
  }

  // Calculate the start index (1-based)
  const start = Math.min((page - 1) * limit + 1, total)

  // Calculate the end index
  const end = Math.min(page * limit, total)

  return { start, end, total }
}

export function PaginationInfo({
  meta,
  className,
  resultsLabel = 'results'
}: PaginationInfoProps) {
  const range = calculateRange(meta)

  // Handle no results case
  if (range.total === 0) {
    return (
      <span className={cn('text-sm text-muted-foreground', className)}>
        No {resultsLabel} found
      </span>
    )
  }

  // Handle single result case
  if (range.start === range.end) {
    return (
      <span className={cn('text-sm text-muted-foreground', className)}>
        Showing {range.start} of {range.total} {resultsLabel}
      </span>
    )
  }

  // Handle normal case
  return (
    <span className={cn('text-sm text-muted-foreground', className)}>
      Showing {range.start} to {range.end} of {range.total} {resultsLabel}
    </span>
  )
}
