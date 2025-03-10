'use client'

import * as React from 'react'
import { Suspense, useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { Review } from '@/db/schema'
import { ReviewUserInfo } from './ReviewUserInfo'
import { cn } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { deleteReview } from '@/app/actions/reviews.actions'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

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
  const { user } = useUser()
  const isOwner = user?.id === review.userId
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteReview(review.id)
        toast.success('Review deleted successfully')
      } catch (error) {
        console.error('Failed to delete review:', error)
        toast.error('Failed to delete review')
      }
    })
  }

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
        {isEditing ? (
          <ReviewForm
            editionId={review.editionId}
            reviewId={review.id}
            defaultValues={{ content: review.content }}
            onSuccess={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className='space-y-2'>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              {review.content}
            </p>
          </div>
        )}
      </CardContent>
      {isOwner && !isEditing && (
        <CardFooter className='relative z-10 flex justify-end gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsEditing(true)}
            className='text-muted-foreground hover:text-foreground'
          >
            <Pencil className='h-4 w-4 mr-1' />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                className='text-destructive hover:text-destructive/80'
              >
                <Trash2 className='h-4 w-4 mr-1' />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Review</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this review? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isPending}
                  className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                >
                  {isPending ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}
    </Card>
  )
}
