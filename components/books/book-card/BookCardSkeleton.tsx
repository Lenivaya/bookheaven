'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function BookCardSkeleton() {
  return (
    <Card className='h-full overflow-hidden border-border/40 bg-background dark:bg-card/95'>
      <div className='grid grid-cols-[100px_1fr] gap-3 p-3'>
        {/* Book cover skeleton */}
        <div className='relative h-[150px] w-[100px] overflow-hidden rounded-sm'>
          <Skeleton className='h-full w-full' />
        </div>

        {/* Book details skeleton */}
        <div className='flex flex-col'>
          {/* Title skeleton */}
          <div className='p-0 pb-1'>
            <Skeleton className='h-5 w-full max-w-[150px]' />

            {/* Author skeleton */}
            <Skeleton className='mt-1 h-3.5 w-3/4' />
          </div>

          {/* Description skeleton */}
          <div className='flex-grow py-1'>
            <Skeleton className='h-3 w-full mb-1' />
            <Skeleton className='h-3 w-5/6' />
          </div>

          {/* Footer skeleton */}
          <div className='mt-auto flex flex-col items-start gap-1.5 pt-1'>
            {/* Tags skeleton */}
            <div className='h-[30px] flex gap-1'>
              <Skeleton className='h-5 w-12 rounded-full' />
              <Skeleton className='h-5 w-16 rounded-full' />
              <Skeleton className='h-5 w-14 rounded-full' />
            </div>

            {/* Price and details skeleton */}
            <div className='flex w-full items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-4 w-14' />
                <Skeleton className='h-6 w-12' />
              </div>

              <Skeleton className='h-3 w-20' />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
