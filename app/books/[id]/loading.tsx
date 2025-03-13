import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

export default function BookDetailLoading() {
  return (
    <main className='container max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-16 mt-24'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {/* Left column - Book cover and actions skeleton */}
        <div className='md:col-span-1'>
          <div className='sticky top-32'>
            <Skeleton className='aspect-[2/3] w-full rounded-lg mb-6' />
            <div className='space-y-2'>
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-10 w-full' />
            </div>
          </div>
        </div>

        {/* Right column - Book details skeleton */}
        <div className='md:col-span-2'>
          <div className='bg-background rounded-lg p-6 shadow-sm'>
            {/* Book header skeleton */}
            <div className='space-y-4'>
              <Skeleton className='h-10 w-3/4' />
              <Skeleton className='h-6 w-1/2' />
              <Skeleton className='h-6 w-1/3' />
            </div>

            <Separator className='my-6' />

            {/* Book info skeleton */}
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Skeleton className='h-5 w-1/3' />
                  <Skeleton className='h-4 w-2/3' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-5 w-1/3' />
                  <Skeleton className='h-4 w-2/3' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-5 w-1/3' />
                  <Skeleton className='h-4 w-2/3' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-5 w-1/3' />
                  <Skeleton className='h-4 w-2/3' />
                </div>
              </div>
              <div className='space-y-2 pt-4'>
                <Skeleton className='h-5 w-1/4' />
                <Skeleton className='h-20 w-full' />
              </div>
            </div>

            <Separator className='my-6' />

            {/* Ratings skeleton */}
            <div className='space-y-6'>
              <div className='space-y-4'>
                <Skeleton className='h-8 w-40' />
                <div className='flex flex-col md:flex-row items-start md:items-center gap-6'>
                  <Skeleton className='h-32 w-32' />
                  <div className='flex-1 w-full space-y-2'>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className='h-3 w-full' />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator className='my-6' />

            {/* Reviews skeleton */}
            <div className='space-y-4'>
              <Skeleton className='h-8 w-40' />
              {[1, 2, 3].map((i) => (
                <div key={i} className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-10 w-10 rounded-full' />
                    <Skeleton className='h-4 w-32' />
                  </div>
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-3/4' />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
