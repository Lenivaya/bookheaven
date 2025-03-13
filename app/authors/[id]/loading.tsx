import { BookCardSkeleton } from '@/components/books/book-card/BookCardSkeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

export default function AuthorPageLoading() {
  return (
    <div className='container mx-auto py-8 mt-20'>
      {/* Author Information Section */}
      <Card className='mb-8 overflow-hidden'>
        <CardContent className='p-8'>
          <div className='flex flex-col md:flex-row gap-8'>
            {/* Author Avatar Skeleton */}
            <div className='flex flex-col items-center gap-4'>
              <Skeleton className='h-48 w-48 rounded-full border-4 border-background shadow-xl' />
              <Skeleton className='h-6 w-32' /> {/* Date badge skeleton */}
            </div>

            {/* Author Info Skeleton */}
            <div className='flex-1 space-y-6'>
              <div>
                <Skeleton className='h-12 w-2/3 mb-4' /> {/* Author name */}
                {/* Author Statistics */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                  {/* Books Stats Card */}
                  <Card className='bg-primary/5 border-primary/10'>
                    <CardContent className='p-4 flex items-center gap-3'>
                      <Skeleton className='h-9 w-9 rounded-lg' />
                      <div className='space-y-2'>
                        <Skeleton className='h-4 w-16' />
                        <Skeleton className='h-8 w-12' />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Likes Stats Card */}
                  <Card className='bg-rose-500/5 border-rose-500/10'>
                    <CardContent className='p-4 flex items-center gap-3'>
                      <Skeleton className='h-9 w-9 rounded-lg' />
                      <div className='space-y-2'>
                        <Skeleton className='h-4 w-20' />
                        <Skeleton className='h-8 w-12' />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Followers Stats Card */}
                  <Card className='bg-blue-500/5 border-blue-500/10'>
                    <CardContent className='p-4 flex items-center gap-3'>
                      <Skeleton className='h-9 w-9 rounded-lg' />
                      <div className='space-y-2'>
                        <Skeleton className='h-4 w-16' />
                        <Skeleton className='h-8 w-12' />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Shelves Stats Card */}
                  <Card className='bg-amber-500/5 border-amber-500/10'>
                    <CardContent className='p-4 flex items-center gap-3'>
                      <Skeleton className='h-9 w-9 rounded-lg' />
                      <div className='space-y-2'>
                        <Skeleton className='h-4 w-20' />
                        <Skeleton className='h-8 w-12' />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Biography Skeleton */}
              <div className='space-y-2'>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className='h-4 w-full' />
                ))}
                <Skeleton className='h-4 w-3/4' />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className='my-8' />

      {/* Books Section */}
      <div>
        <div className='flex items-center justify-between mb-6'>
          <Skeleton className='h-10 w-64' /> {/* Section title */}
        </div>

        {/* Search Bar Skeleton */}
        <div className='flex flex-col justify-between mb-8 w-full'>
          <Skeleton className='h-10 w-full max-w-xl' />
        </div>

        {/* Books Grid Skeleton */}
        <div className='min-h-[70vh]'>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
            {Array.from({ length: 9 }).map((_, index) => (
              <BookCardSkeleton key={index} />
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className='mt-8 flex justify-center'>
            <div className='flex items-center gap-2'>
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className='h-9 w-9 rounded-md' />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
