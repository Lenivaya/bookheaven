import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  type LucideIcon
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink
} from '@/components/ui/pagination'
import { PaginationInfo } from './PaginationInfo'

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  pageCount: number
}

export interface PaginationIconProps {
  /** First page icon */
  first?: LucideIcon
  /** Previous page icon */
  previous?: LucideIcon
  /** Next page icon */
  next?: LucideIcon
  /** Last page icon */
  last?: LucideIcon
}

export interface PaginationLabelsProps {
  /** Text for "Show" label */
  show?: string
  /** Text for "per page" label */
  perPage?: string
  /** Text for "results" label */
  results?: string
  /** Text for "Page" label */
  page?: string
  /** Text for "of" label */
  of?: string
}

export interface PaginationStylesProps {
  /** Root container className */
  container?: string
  /** Info section className */
  info?: string
  /** Page size selector className */
  pageSize?: string
  /** Navigation section className */
  navigation?: string
}

export interface PaginationProps {
  /**
   * Current pagination meta information
   */
  meta: PaginationMeta
  /**
   * Callback fired when page changes
   */
  onPageChange: (page: number) => void
  /**
   * Callback fired when items per page changes
   */
  onLimitChange?: (limit: number) => void
  /**
   * Available page size options
   * @default [10, 20, 30, 40, 50]
   */
  pageSizeOptions?: number[]
  /**
   * Whether to show the page size selector
   * @default true
   */
  showPageSize?: boolean
  /**
   * Whether to show the results information
   * @default true
   */
  showInfo?: boolean
  /**
   * Custom icons for navigation buttons
   */
  icons?: PaginationIconProps
  /**
   * Custom labels for text elements
   */
  labels?: PaginationLabelsProps
  /**
   * Custom styles for different sections
   */
  styles?: PaginationStylesProps
  /**
   * Custom className for the container
   * @deprecated Use styles.container instead
   */
  className?: string
}

/**
 * Validates and normalizes pagination meta data
 */
function normalizeMeta(meta: PaginationMeta): PaginationMeta {
  const { page, limit, total } = meta

  // Ensure positive numbers
  const normalizedTotal = Math.max(0, total)
  const normalizedLimit = Math.max(1, limit)

  // Calculate actual page count
  const pageCount = Math.max(1, Math.ceil(normalizedTotal / normalizedLimit))

  // Ensure page is within bounds
  const normalizedPage = Math.min(Math.max(1, page), pageCount)

  return {
    page: normalizedPage,
    limit: normalizedLimit,
    total: normalizedTotal,
    pageCount
  }
}

export function Pagination({
  meta: rawMeta,
  onPageChange,
  onLimitChange,
  pageSizeOptions = [10, 20, 30, 40, 50],
  showPageSize = true,
  showInfo = true,
  icons = {},
  labels = {},
  styles = {},
  className
}: PaginationProps) {
  // Normalize meta to handle edge cases
  const meta = React.useMemo(() => normalizeMeta(rawMeta), [rawMeta])
  const { page, pageCount } = meta

  const {
    first: FirstIcon = ChevronsLeft,
    previous: PreviousIcon = ChevronLeft,
    next: NextIcon = ChevronRight,
    last: LastIcon = ChevronsRight
  } = icons

  const {
    show = 'Show',
    perPage = 'per page',
    results = 'results',
    page: pageLabel = 'Page',
    of: ofLabel = 'of'
  } = labels

  const canGoPrevious = page > 1
  const canGoNext = page < pageCount

  const handlePageChange = React.useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= pageCount) {
        onPageChange(newPage)
      }
    },
    [pageCount, onPageChange]
  )

  const handleLimitChange = React.useCallback(
    (value: string) => {
      onLimitChange?.(Number(value))
    },
    [onLimitChange]
  )

  // Don't render pagination if there's no data
  if (meta.total === 0) {
    return showInfo ? (
      <PaginationInfo meta={meta} resultsLabel={results} />
    ) : null
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4',
        styles.container,
        className
      )}
    >
      <PaginationRoot className={styles.navigation}>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              onClick={() => handlePageChange(1)}
              isActive={false}
              className={cn(
                'transition-opacity hover:opacity-80',
                !canGoPrevious && 'pointer-events-none opacity-50'
              )}
              aria-label='Go to first page'
            >
              <FirstIcon className='h-4 w-4' />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              onClick={() => handlePageChange(page - 1)}
              isActive={false}
              className={cn(
                'transition-opacity hover:opacity-80',
                !canGoPrevious && 'pointer-events-none opacity-50'
              )}
              aria-label='Go to previous page'
            >
              <PreviousIcon className='h-4 w-4' />
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <span className='flex items-center gap-1 px-2'>
              <span className='text-sm font-medium'>
                {pageLabel} {page}
              </span>
              <span className='text-sm text-muted-foreground'>
                {ofLabel} {pageCount}
              </span>
            </span>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              onClick={() => handlePageChange(page + 1)}
              isActive={false}
              className={cn(
                'transition-opacity hover:opacity-80',
                !canGoNext && 'pointer-events-none opacity-50'
              )}
              aria-label='Go to next page'
            >
              <NextIcon className='h-4 w-4' />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              onClick={() => handlePageChange(pageCount)}
              isActive={false}
              className={cn(
                'transition-opacity hover:opacity-80',
                !canGoNext && 'pointer-events-none opacity-50'
              )}
              aria-label='Go to last page'
            >
              <LastIcon className='h-4 w-4' />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </PaginationRoot>

      <div
        className={cn(
          'flex items-center gap-4 text-sm text-muted-foreground',
          styles.info
        )}
      >
        {showInfo && (
          <PaginationInfo
            meta={meta}
            resultsLabel={results}
            className={styles.info}
          />
        )}
        {showPageSize && onLimitChange && (
          <div className={cn('flex items-center gap-2', styles.pageSize)}>
            <span>{show}</span>
            <Select
              value={String(meta.limit)}
              onValueChange={handleLimitChange}
            >
              <SelectTrigger className='h-8 w-[70px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>{perPage}</span>
          </div>
        )}
      </div>
    </div>
  )
}
