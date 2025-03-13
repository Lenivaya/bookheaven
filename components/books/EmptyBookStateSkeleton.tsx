import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface EmptyBookStateSkeletonProps {
  className?: string
  minHeight?: string
}

/**
 * A skeleton loader for the EmptyBookState component
 */
export function EmptyBookStateSkeleton({
  className,
  minHeight = 'min-h-[70vh]'
}: EmptyBookStateSkeletonProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center py-16',
        minHeight,
        className
      )}
    >
      <div className='rounded-lg border border-dashed p-8 text-center max-w-md mx-auto w-full'>
        <div className='flex justify-center'>
          <Skeleton className='h-12 w-12 rounded-full' />
        </div>
        <Skeleton className='h-6 w-48 mx-auto mt-4' />
        <Skeleton className='h-4 w-full mx-auto mt-2' />
        <Skeleton className='h-4 w-3/4 mx-auto mt-1' />
      </div>
    </div>
  )
}
