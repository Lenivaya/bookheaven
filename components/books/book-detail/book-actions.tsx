'use client'

import { Button } from '@/components/ui/button'
import { BookmarkIcon, StarIcon, Share2Icon, ListPlusIcon } from 'lucide-react'
import { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { toggleBookLike } from '@/app/actions/books.actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface BookActionsProps {
  bookId: string
  workId: string
}

export default function BookActions({ bookId, workId }: BookActionsProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleLike = async () => {
    try {
      setIsLoading(true)
      await toggleBookLike(bookId)
      setIsLiked(!isLiked)
      toast.success(
        isLiked ? 'Removed from your library' : 'Added to your library'
      )
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'
      toast.error(`Failed to update library: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-2 gap-3'>
        <Button
          variant={isLiked ? 'default' : 'outline'}
          className={cn(
            'w-full transition-all',
            isLiked && 'bg-primary text-primary-foreground'
          )}
          onClick={handleToggleLike}
          disabled={isLoading}
        >
          <BookmarkIcon
            className={cn(
              'w-4 h-4 mr-2 transition-all',
              isLiked && 'fill-current'
            )}
          />
          {isLiked ? 'Saved' : 'Save'}
        </Button>

        <RatingPopover workId={workId} />
      </div>

      <div className='grid grid-cols-1 gap-3'>
        <Button variant='outline' className='w-full'>
          <ListPlusIcon className='w-4 h-4 mr-2' />
          Add to List
        </Button>

        <Button variant='outline' className='w-full'>
          <Share2Icon className='w-4 h-4 mr-2' />
          Share
        </Button>
      </div>
    </div>
  )
}

function RatingPopover({ workId }: { workId: string }) {
  const [rating, setRating] = useState<number | null>(null)
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRate = async (value: number) => {
    try {
      setIsSubmitting(true)
      // This would call a server action to save the rating
      console.log(`Rating ${value} stars for book work ${workId}`)
      setRating(value)
      setIsOpen(false)
      toast.success(
        `You rated this book ${value} ${value === 1 ? 'star' : 'stars'}`
      )
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      toast.error(`Failed to submit rating: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={rating ? 'default' : 'outline'}
          className={cn(
            'w-full transition-all',
            rating &&
              'bg-yellow-500/90 hover:bg-yellow-500 text-white border-yellow-500'
          )}
        >
          <StarIcon
            className={cn(
              'w-4 h-4 mr-2 transition-all',
              rating && 'fill-white'
            )}
          />
          {rating ? `Rated ${rating}` : 'Rate'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-4'>
        <div className='space-y-3'>
          <h4 className='font-medium text-center'>Rate this book</h4>
          <div className='flex justify-center gap-1'>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className='p-1 transition-transform hover:scale-110 disabled:opacity-50'
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(null)}
                onClick={() => handleRate(star)}
                disabled={isSubmitting}
              >
                <StarIcon
                  className={cn(
                    'w-8 h-8 transition-colors',
                    star <= (hoveredRating || rating || 0)
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-muted-foreground'
                  )}
                />
              </button>
            ))}
          </div>
          {hoveredRating && (
            <div className='text-center text-sm font-medium'>
              {hoveredRating === 1 && 'Did not like it'}
              {hoveredRating === 2 && 'It was okay'}
              {hoveredRating === 3 && 'Liked it'}
              {hoveredRating === 4 && 'Really liked it'}
              {hoveredRating === 5 && 'Loved it!'}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
