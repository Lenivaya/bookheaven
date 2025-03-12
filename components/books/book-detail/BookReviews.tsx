import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  getReviews,
  hasReviewedBookEdition
} from '@/app/actions/reviews.actions'
import {
  ReviewCard,
  ReviewCardSkeleton
} from '@/components/reviews/review-card/ReviewCard'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { Separator } from '@/components/ui/separator'
import { Protect } from '@clerk/nextjs'

interface BookReviewsProps {
  editionId: string
}

export default async function BookReviews({ editionId }: BookReviewsProps) {
  const [reviews, hasReviewed] = await Promise.all([
    getReviews(editionId),
    hasReviewedBookEdition(editionId)
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <Protect>
          {hasReviewed ? null : <ReviewForm editionId={editionId} />}
          <Separator className='my-6' />
        </Protect>

        {reviews.length > 0 && (
          <>
            <div className='space-y-6'>
              {reviews.map((review) => (
                <ReviewCard
                  key={review.review.id}
                  review={review.review}
                  rating={review.rating}
                />
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function BookReviewsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='h-40 bg-muted rounded animate-pulse' />
        <Separator className='my-6' />
        <div className='space-y-6'>
          {[1, 2, 3].map((i) => (
            <ReviewCardSkeleton key={i} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
