import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AuthorPageBookGridProps {
  children: ReactNode
  className?: string
}

/**
 * A specialized grid layout for books on author pages
 * - Ensures books take full width
 * - Limits to a maximum of 3 books per row
 * - Maintains consistent spacing
 */
export function AuthorPageBookGrid({
  children,
  className
}: AuthorPageBookGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8',
        className
      )}
    >
      {children}
    </div>
  )
}
