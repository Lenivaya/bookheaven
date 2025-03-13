import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ResponsiveBookCardGridProps {
  children: ReactNode
  className?: string
  compact?: boolean
}

/**
 * A responsive grid layout for book cards
 *
 * @param children - The book cards to display
 * @param className - Additional classes to apply to the grid
 * @param compact - Whether to use a more compact layout with smaller gaps
 */
export function ResponsiveBookCardGrid({
  children,
  className,
  compact = false
}: ResponsiveBookCardGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4',
        // Responsive grid with different breakpoints
        'xs:grid-cols-2',
        'sm:grid-cols-2',
        'md:grid-cols-3',
        'lg:grid-cols-4',
        'xl:grid-cols-5',
        '2xl:grid-cols-6',
        // Adjust gap based on compact mode and screen size
        compact ? 'gap-3 xs:gap-3 sm:gap-4' : 'gap-4 sm:gap-5 md:gap-6',
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * A responsive grid layout for featured book cards (larger, fewer columns)
 */
export function FeaturedBookCardGrid({
  children,
  className
}: Omit<ResponsiveBookCardGridProps, 'compact'>) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4',
        'sm:grid-cols-2',
        'lg:grid-cols-3',
        'xl:grid-cols-4',
        'gap-4 sm:gap-5 md:gap-6',
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * A responsive grid layout for book cards in a sidebar or narrow container
 */
export function SidebarBookCardGrid({
  children,
  className
}: Omit<ResponsiveBookCardGridProps, 'compact'>) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-3',
        'sm:grid-cols-2',
        'xl:grid-cols-3',
        className
      )}
    >
      {children}
    </div>
  )
}
