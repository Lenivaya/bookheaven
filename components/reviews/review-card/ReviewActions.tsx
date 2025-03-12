'use client'

import * as React from 'react'
import { useState, useTransition } from 'react'
import { Review } from '@/db/schema'
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

interface ReviewActionsProps {
  review: Review
}

export function ReviewActions({ review }: ReviewActionsProps) {
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

  if (!isOwner) {
    return null
  }

  if (isEditing) {
    return (
      <div className='w-full'>
        <ReviewForm
          editionId={review.editionId}
          reviewId={review.id}
          defaultValues={{ content: review.content }}
          onSuccess={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    )
  }

  return (
    <>
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
              Are you sure you want to delete this review? This action cannot be
              undone.
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
    </>
  )
}
