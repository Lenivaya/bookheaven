'use client'

import * as React from 'react'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ReviewCard,
  ReviewCardSkeleton
} from '@/components/reviews/review-card/ReviewCard'
import { getReviews } from '@/app/actions/reviews.actions'
import { useQuery } from '@tanstack/react-query'
import { Separator } from '@/components/ui/separator'

interface BookReviewsProps {
  editionId: string
}

export default function BookReviews({ editionId }: BookReviewsProps) {
  const { data: reviews, refetch } = useQuery({
    queryKey: ['reviews', editionId],
    queryFn: () => getReviews(editionId)
  })

  const handleReviewSuccess = () => {
    refetch()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <ReviewForm editionId={editionId} onSuccess={handleReviewSuccess} />

        {reviews && reviews.length > 0 && (
          <>
            <Separator className='my-6' />
            <div className='space-y-6'>
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
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
