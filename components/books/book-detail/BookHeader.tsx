import { Author } from '@/db/schema/books.schema'
import { Link } from 'next-view-transitions'

import { StarIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getWorkAverageRating } from '@/app/actions/ratings.actions'

interface BookHeaderProps {
  title: string
  originalTitle?: string | null
  authors: Author[]
  workId: string
}

export default async function BookHeader({
  title,
  originalTitle,
  authors,
  workId
}: BookHeaderProps) {
  // Fetch rating data
  const ratingStats = await getWorkAverageRating(workId)

  // Ensure averageRating is a number
  const averageRating = Number(ratingStats.averageRating) || 0
  const { totalRatings } = ratingStats

  const displayRating = averageRating ? averageRating.toFixed(1) : '0.0'

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight leading-tight'>
          {title}
        </h1>
        {originalTitle && (
          <p className='text-muted-foreground italic'>
            Original title: {originalTitle}
          </p>
        )}
      </div>

      <div className='flex flex-wrap gap-2 text-lg'>
        <span className='text-muted-foreground'>By</span>
        {authors.map((author, index) => (
          <span key={author.id}>
            <Link
              href={`/authors/${author.id}`}
              className='hover:underline font-medium text-primary'
            >
              {author.name}
            </Link>
            {index < authors.length - 1 && ', '}
          </span>
        ))}
      </div>

      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-1 bg-muted/50 px-3 py-1 rounded-full'>
          <StarIcon className='w-5 h-5 text-yellow-500 fill-yellow-500' />
          <span className='font-medium'>{displayRating}</span>
          <span className='text-muted-foreground text-sm'>
            ({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
          </span>
        </div>

        {totalRatings > 0 && (
          <Badge variant='outline' className='px-3 py-1 font-normal'>
            {averageRating >= 4.5
              ? 'Highly Rated'
              : averageRating >= 4
                ? 'Well Liked'
                : averageRating >= 3
                  ? 'Average'
                  : 'Mixed Reviews'}
          </Badge>
        )}
      </div>
    </div>
  )
}
