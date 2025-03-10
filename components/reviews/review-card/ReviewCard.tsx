'use client'

import * as React from 'react'
import { Suspense } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Review } from '@/db/schema'
import { ReviewUserInfo } from './ReviewUserInfo'

interface ReviewCardProps {
  review: Review
}

export function ReviewCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className='h-8 bg-muted rounded animate-pulse' />
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          <div className='h-4 bg-muted rounded w-3/4 animate-pulse' />
          <div className='h-4 bg-muted rounded w-1/2 animate-pulse' />
        </div>
      </CardContent>
    </Card>
  )
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <Suspense
          fallback={<div className='h-8 bg-muted rounded animate-pulse' />}
        >
          <ReviewUserInfo
            userId={review.userId}
            createdAt={review.created_at}
          />
        </Suspense>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground'>{review.content}</p>
      </CardContent>
    </Card>
  )
}
