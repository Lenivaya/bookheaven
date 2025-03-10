'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { upsertReview } from '@/app/actions/reviews.actions'

const reviewFormSchema = z.object({
  content: z
    .string()
    .min(10, {
      message: 'Review must be at least 10 characters.'
    })
    .max(500, {
      message: 'Review cannot be longer than 500 characters.'
    })
})

type ReviewFormValues = z.infer<typeof reviewFormSchema>

interface ReviewFormProps {
  editionId: string
  onSuccess?: () => void
}

export function ReviewForm({ editionId, onSuccess }: ReviewFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      content: ''
    }
  })

  function onSubmit(data: ReviewFormValues) {
    startTransition(async () => {
      try {
        await upsertReview({
          content: data.content,
          editionId
        })
        form.reset()
        toast.success('Review submitted successfully')
        onSuccess?.()
      } catch (error: unknown) {
        console.error('Failed to submit review:', error)
        toast.error('Failed to submit review')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Write your review here...'
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Share your thoughts about this book with other readers.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isPending}>
          {isPending ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </Form>
  )
}
