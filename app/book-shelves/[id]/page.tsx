import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getBookById } from '@/app/actions/books.actions'
import { isNone } from '@/lib/types'
import { Separator } from '@/components/ui/separator'
import BookHeader from '@/components/books/book-detail/BookHeader'
import BookInfo from '@/components/books/book-detail/BookInfo'
import BookRatings from '@/components/books/book-detail/BookRatings'
import BookActions from '@/components/books/book-detail/BookActions'
import BookCover from '@/components/books/book-detail/BookCover'
import BookReviews from '@/components/books/book-detail/BookReviews'
import { Skeleton } from '@/components/ui/skeleton'

interface BookPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function BookPage({ params }: BookPageProps) {
  // Always await params in Next.js App Router
  const { id } = await params

  // Fetch the basic book data needed for the page structure
  const bookData = await getBookById(id)

  if (isNone(bookData)) {
    notFound()
  }

  const { edition, work, authors, tags } = bookData

  return (
    <main className='container max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-16 mt-24'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {/* Left column - Book cover and actions */}
        <div className='md:col-span-1'>
          <div className='sticky top-32'>
            <BookCover
              thumbnailUrl={edition.thumbnailUrl}
              title={work.title}
              className='mb-6'
            />

            <BookActions editionId={edition.id} />
          </div>
        </div>

        {/* Right column - Book details */}
        <div className='md:col-span-2'>
          <div className='bg-background rounded-lg p-6 shadow-sm'>
            {/* BookHeader fetches rating data, so it needs Suspense */}
            <Suspense fallback={<BookHeaderSkeleton />}>
              <BookHeader
                title={work.title}
                originalTitle={work.originalTitle}
                authors={authors}
                workId={work.id}
              />
            </Suspense>

            <Separator className='my-6' />

            {/* BookInfo doesn't fetch data, so no Suspense needed */}
            <BookInfo book={edition} work={work} tags={tags} />

            <Separator className='my-6' />

            {/* BookRatings fetches rating distribution data, so it needs Suspense */}
            <Suspense fallback={<BookRatingsSkeleton />}>
              <BookRatings workId={work.id} />
            </Suspense>

            <Separator className='my-6' />

            {/* Reviews section */}
            <Suspense fallback={<BookReviewsSkeleton />}>
              <BookReviews editionId={edition.id} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}

// Skeleton loader for the BookHeader component while it fetches rating data
function BookHeaderSkeleton() {
  return (
    <div className='space-y-4'>
      <Skeleton className='h-10 w-3/4' />
      <Skeleton className='h-6 w-1/2' />
      <Skeleton className='h-6 w-1/3' />
    </div>
  )
}

// Skeleton loader for the BookRatings component while it fetches rating distribution data
function BookRatingsSkeleton() {
  return (
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
  )
}

// Skeleton loader for the BookReviews component
function BookReviewsSkeleton() {
  return (
    <div className='space-y-4'>
      <Skeleton className='h-8 w-40' />
      <Skeleton className='h-32 w-full' />
    </div>
  )
}
