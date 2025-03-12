import { BookCardSkeleton } from '@/components/books/book-card/BookCardSkeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function BooksLoading() {
  return (
    <div className='container mx-auto py-8 mt-20'>
      <div className='flex flex-col justify-between mb-5 w-full'>
        {/* Search bar skeleton */}
        <div className='w-full max-w-3xl mx-auto'>
          <Skeleton className='h-10 w-full rounded-md' />
        </div>
      </div>

      <div className='min-h-[70vh]'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {Array.from({ length: 9 }).map((_, index) => (
            <BookCardSkeleton key={index} />
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
