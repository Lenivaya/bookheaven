'use client'

import * as React from 'react'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BookReviewsProps {
  editionId: string
}

export default function BookReviews({ editionId }: BookReviewsProps) {
  const handleReviewSuccess = () => {
    // In a real app, we would refresh the reviews list here
    // For now, we'll just show a success message via the form component
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <ReviewForm editionId={editionId} onSuccess={handleReviewSuccess} />
      </CardContent>
    </Card>
  )
}
