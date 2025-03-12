import { getReviews } from '@/app/actions/reviews.actions'
import { ReviewCardSkeleton } from '@/components/reviews/review-card/ReviewCard'
import { ReviewCardWithReviewedBook } from '@/components/reviews/review-card/ReviewCardWithReviewedBook'
import { ReviewsPagination } from '@/components/reviews/review-pagination/ReviewsPagination'
import { ReviewsSearch } from '@/components/reviews/review-search/ReviewsSearch'
import { Separator } from '@/components/ui/separator'
import { Suspense } from 'react'
import { reviewSearchParamsCache } from './searchParams'
import { SearchParams } from 'nuqs/server'

const DEFAULT_PAGE_SIZE = 6

async function UserReviewsList({
  params
}: {
  params: Awaited<ReturnType<typeof reviewSearchParamsCache.parse>>
}) {
  const { userIds } = params

  // Get reviews with search filters for the current user
  // Note: getReviews expects a bookEditionId, but we're using an empty string
  // and relying on the userIds filter to get the user's reviews
  const reviews = await getReviews(undefined, {
    limit: DEFAULT_PAGE_SIZE,
    offset: (Number(params.page) - 1) * DEFAULT_PAGE_SIZE,
    search: params.q,
    userIds: userIds,
    searchOverBooks: true
  })

  if (reviews.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[50vh]'>
        <div className='rounded-lg border border-dashed p-8 text-center max-w-md mx-auto'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='mx-auto h-12 w-12 text-muted-foreground'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
            />
          </svg>
          <h3 className='mt-4 text-lg font-semibold'>No reviews found</h3>
          <p className='mt-2 text-sm text-muted-foreground'>
            Try adjusting your search to find what you&apos;re looking for.
          </p>
        </div>
      </div>
    )
  }

  // Calculate total count and page count
  const totalCount = reviews.length
  const pageCount = Math.ceil(totalCount / DEFAULT_PAGE_SIZE)

  return (
    <>
      <div className='min-h-[70vh]'>
        <div className='grid grid-cols-1 gap-6'>
          {reviews.map((item) => (
            <ReviewCardWithReviewedBook
              key={item.review.id}
              review={item.review}
              rating={item.rating}
            />
          ))}
        </div>
      </div>

      {totalCount > DEFAULT_PAGE_SIZE && (
        <div className='mt-8'>
          <ReviewsPagination
            currentPage={Number(params.page)}
            pageCount={pageCount}
            totalCount={totalCount}
            pageSize={DEFAULT_PAGE_SIZE}
          />
        </div>
      )}
    </>
  )
}

interface ReviewsPageProps {
  searchParams: Promise<SearchParams>
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const params = await reviewSearchParamsCache.parse(searchParams)

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight'>Reviews</h2>
        <p className='text-muted-foreground'>Your book reviews and ratings.</p>
      </div>

      <Separator />

      <div className='flex flex-col justify-between mb-5 w-full'>
        <ReviewsSearch />
      </div>

      <Suspense
        fallback={
          <div className='min-h-[70vh]'>
            <div className='grid grid-cols-1 gap-6'>
              {Array.from({ length: 6 }).map((_, index) => (
                <ReviewCardSkeleton key={index} />
              ))}
            </div>
          </div>
        }
      >
        <UserReviewsList params={params} />
      </Suspense>
    </div>
  )
}
