import { AuthorCardSkeleton } from '@/components/authors/author-card/AuthorCardSkeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function AuthorsLoading() {
  return (
    <div className='container mx-auto py-8 mt-20'>
      <div className='flex flex-col justify-between mb-5 w-full'>
        {/* Page title skeleton */}
        <Skeleton className='h-10 w-48 mb-6' />

        {/* Search bar skeleton */}
        <div className='w-full max-w-xl mx-auto'>
          <Skeleton className='h-10 w-full rounded-md' />
        </div>
      </div>

      <div className='min-h-[70vh]'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {Array.from({ length: 12 }).map((_, index) => (
            <AuthorCardSkeleton key={index} />
          ))}
        </div>
      </div>

      {/* Pagination skeleton */}
      <div className='mt-8 flex justify-center'>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-9 w-9 rounded-md' />
          <Skeleton className='h-9 w-9 rounded-md' />
          <Skeleton className='h-9 w-9 rounded-md' />
          <Skeleton className='h-9 w-9 rounded-md' />
          <Skeleton className='h-9 w-9 rounded-md' />
        </div>
      </div>
    </div>
  )
}
