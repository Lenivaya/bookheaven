import { RatingValue } from '@/db/schema/ratings.schema'
import { StarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getWorkAverageRating,
  getBookRatingsDistribution
} from '@/app/actions/ratings.actions'

interface BookRatingsProps {
  workId: string
}

export default async function BookRatings({ workId }: BookRatingsProps) {
  // Fetch ratings data in parallel
  const [ratingStats, distribution] = await Promise.all([
    getWorkAverageRating(workId),
    getBookRatingsDistribution(workId)
  ])

  // Ensure averageRating is a number
  const averageRating = Number(ratingStats.averageRating) || 0
  const { totalRatings } = ratingStats

  const displayRating = averageRating ? averageRating.toFixed(1) : '0.0'

  // Calculate the maximum count for scaling the bars
  const maxCount = Math.max(...Object.values(distribution))

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold'>Ratings & Reviews</h2>
          {totalRatings > 0 && (
            <span className='text-sm text-muted-foreground'>
              Based on {totalRatings}{' '}
              {totalRatings === 1 ? 'rating' : 'ratings'}
            </span>
          )}
        </div>

        <div className='flex flex-col md:flex-row items-start md:items-center gap-6'>
          <div className='flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg min-w-[120px]'>
            <div className='text-5xl font-bold'>{displayRating}</div>
            <div className='flex items-center mt-2'>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={cn(
                    'w-5 h-5',
                    star <= Math.round(averageRating)
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-muted-foreground'
                  )}
                />
              ))}
            </div>
          </div>

          <div className='flex-1 w-full'>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = distribution[rating as RatingValue]
              const percentage =
                totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0
              const barWidth =
                maxCount > 0 ? `${(count / maxCount) * 100}%` : '0%'

              return (
                <div key={rating} className='flex items-center gap-3 mb-2'>
                  <div className='flex items-center min-w-[40px]'>
                    <span className='text-sm font-medium'>{rating}</span>
                    <StarIcon className='w-4 h-4 ml-1 text-yellow-500 fill-yellow-500' />
                  </div>
                  <div className='flex-1 h-3 bg-muted rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-yellow-500 rounded-full transition-all duration-500 ease-out'
                      style={{ width: barWidth }}
                    />
                  </div>
                  <div className='w-12 text-right text-sm text-muted-foreground'>
                    {percentage}%
                  </div>
                  <div className='w-10 text-right text-sm text-muted-foreground hidden md:block'>
                    {count}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div className='space-y-4'>
        <h3 className='text-lg font-medium'>Reviews</h3>
        <div className='py-8 text-center text-muted-foreground border border-dashed rounded-lg bg-muted/30'>
          <p>No reviews yet. Be the first to review this book!</p>
        </div>
      </div>
    </div>
  )
}
