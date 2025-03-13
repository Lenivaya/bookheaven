'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function BookCardSkeleton() {
  return (
    <Card className='h-full overflow-hidden border-border/40 bg-background dark:bg-card/95'>
      <div className='grid grid-cols-1 xs:grid-cols-[90px_1fr] sm:grid-cols-[100px_1fr] md:grid-cols-[110px_1fr] lg:grid-cols-[130px_1fr] gap-2 xs:gap-2 sm:gap-3 lg:gap-4 p-2 xs:p-2 sm:p-3 lg:p-4'>
        {/* Book cover skeleton */}
        <div className='relative h-[140px] xs:h-[130px] sm:h-[150px] md:h-[170px] lg:h-[200px] overflow-hidden rounded-sm'>
          <Skeleton className='h-full w-full' />
        </div>

        {/* Book details skeleton */}
        <div className='flex flex-col'>
          {/* Title skeleton */}
          <div className='p-0 pb-1'>
            <Skeleton className='h-4 xs:h-4 sm:h-5 w-full max-w-[150px]' />

            {/* Author skeleton */}
            <Skeleton className='mt-1 h-3 xs:h-3 sm:h-3.5 w-3/4' />
          </div>

          {/* Description skeleton */}
          <div className='flex-grow py-0.5 xs:py-1'>
            <Skeleton className='h-2.5 xs:h-3 w-full mb-1' />
            <Skeleton className='h-2.5 xs:h-3 w-5/6' />
          </div>

          {/* Footer skeleton */}
          <div className='mt-auto flex flex-col items-start gap-0.5 xs:gap-1 sm:gap-1.5 pt-0.5 xs:pt-1'>
            {/* Tags skeleton */}
            <div className='h-[18px] xs:h-[20px] sm:h-[24px] lg:h-[32px] flex gap-1'>
              <Skeleton className='h-4 xs:h-4 sm:h-5 w-10 xs:w-12 rounded-full' />
              <Skeleton className='h-4 xs:h-4 sm:h-5 w-14 xs:w-16 rounded-full' />
              <Skeleton className='h-4 xs:h-4 sm:h-5 w-12 xs:w-14 rounded-full' />
            </div>

            {/* Price and details skeleton */}
            <div className='flex w-full items-center justify-between mt-0.5 xs:mt-1'>
              <div className='flex items-center gap-1 xs:gap-1 sm:gap-1.5 lg:gap-2.5'>
                <Skeleton className='h-3.5 xs:h-4 w-12 xs:w-14' />
                <Skeleton className='h-5 xs:h-6 w-10 xs:w-12' />
              </div>

              <Skeleton className='h-2.5 xs:h-3 w-16 xs:w-20' />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
