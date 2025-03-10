'use client'

import * as React from 'react'
import { Suspense } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Review } from '@/db/schema'
import { ReviewUserInfo } from './ReviewUserInfo'
import { cn } from '@/lib/utils'

interface ReviewCardProps {
  review: Review
  className?: string
}

export function ReviewCardSkeleton() {
  return (
    <Card className='transition-all duration-200 hover:shadow-lg hover:border-primary/20'>
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

export function ReviewCard({ review, className }: ReviewCardProps) {
  return (
    <Card
      className={cn(
        'transition-all duration-200',
        'hover:shadow-lg hover:border-primary/20',
        'bg-card/50 backdrop-blur-sm',
        'relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-muted/50 before:to-background/50 before:opacity-0 hover:before:opacity-100 before:transition-opacity',
        'after:absolute after:inset-0 after:border-2 after:border-primary/0 hover:after:border-primary/20 after:transition-colors',
        className
      )}
    >
      <CardHeader className='relative z-10'>
        <Suspense
          fallback={<div className='h-8 bg-muted rounded animate-pulse' />}
        >
          <ReviewUserInfo
            userId={review.userId}
            createdAt={review.created_at}
          />
        </Suspense>
      </CardHeader>
      <CardContent className='relative z-10'>
        <div className='space-y-2'>
          <p className='text-sm text-muted-foreground leading-relaxed'>
            {review.content}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
