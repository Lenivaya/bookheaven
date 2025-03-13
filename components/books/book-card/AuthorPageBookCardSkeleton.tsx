import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface AuthorPageBookCardSkeletonProps {
  className?: string
}

/**
 * A skeleton loader for the AuthorPageBookCard component
 */
export function AuthorPageBookCardSkeleton({
  className
}: AuthorPageBookCardSkeletonProps) {
  return (
    <Card
      className={cn(
        'h-full overflow-hidden border-border/40 bg-card/95',
        className
      )}
    >
      <div className='grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 p-4'>
        {/* Book cover skeleton */}
        <Skeleton className='h-[180px] sm:h-[210px] md:h-[240px] w-full rounded-md' />

        {/* Book details skeleton */}
        <div className='flex flex-col'>
          {/* Title */}
          <div className='space-y-2 mb-3'>
            <Skeleton className='h-6 sm:h-7 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
          </div>

          {/* Description */}
          <div className='space-y-2 flex-grow mb-4'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-3/4' />
          </div>

          {/* Tags */}
          <div className='space-y-2 mb-3'>
            <Skeleton className='h-5 w-1/3' />
          </div>

          {/* Price and details */}
          <div className='flex justify-between items-center'>
            <Skeleton className='h-8 w-24' />
            <Skeleton className='h-4 w-20' />
          </div>
        </div>
      </div>
    </Card>
  )
}
