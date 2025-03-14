'use client'

import {
  deleteBookRating,
  getBookEditionAverageRating,
  getUserRating,
  upsertBookRating
} from '@/app/actions/ratings.actions'
import { Button } from '@/components/ui/button'
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { RatingValue } from '@/db/schema/ratings.schema'
import { useBookshelfOptimistic } from '@/hooks/useBookshelfOptimistic'
import { DEFAULT_SYSTEM_SHELVES, DefaultShelves } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  BookCheck,
  Bookmark,
  BookMarked,
  BookOpen,
  BookX,
  X
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { match } from 'ts-pattern'
import { BookRating } from './BookRating'

interface BookActionsProps {
  editionId: string
  bookTitle: string
  currentShelf?: DefaultShelves[] | null
}

export function BookActions({ editionId, bookTitle }: BookActionsProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  // Use our custom hook for optimistic bookshelf updates
  const {
    currentShelf,
    isBookmarked,
    isShelvesLoading,
    handleShelfSelect,
    isPending: isShelfActionPending
  } = useBookshelfOptimistic({
    editionId,
    bookTitle,
    systemShelves: DEFAULT_SYSTEM_SHELVES
  })

  const { data: userRating } = useQuery({
    queryKey: ['userRating', editionId],
    queryFn: () => getUserRating(editionId),
    refetchOnWindowFocus: false,
    enabled: open
  })

  const { data: averageRating } = useQuery({
    queryKey: ['averageRating', editionId],
    queryFn: () => getBookEditionAverageRating(editionId),
    refetchOnWindowFocus: false,
    enabled: open
  })

  const updateRatingMutation = useMutation({
    mutationFn: ({ rating }: { rating: RatingValue }) =>
      upsertBookRating(editionId, rating),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userRating', editionId] })
      queryClient.invalidateQueries({ queryKey: ['averageRating', editionId] })
      toast.success(`Rated "${bookTitle}" with ${variables.rating} stars`)
    },
    onError: (error) => {
      console.error('Failed to update rating:', error)
      toast.error('Failed to update rating')
    }
  })

  const deleteRatingMutation = useMutation({
    mutationFn: () => deleteBookRating(editionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRating', editionId] })
      queryClient.invalidateQueries({ queryKey: ['averageRating', editionId] })
      toast.success(`Removed rating for "${bookTitle}"`)
    },
    onError: (error) => {
      console.error('Failed to delete rating:', error)
      toast.error('Failed to delete rating')
    }
  })

  const getShelfIcon = (shelf: DefaultShelves | null | undefined) => {
    if (!shelf) return <Bookmark className='h-4 w-4' />

    return match(shelf)
      .with('Want to Read', () => <BookMarked className='h-4 w-4' />)
      .with('Currently Reading', () => <BookOpen className='h-4 w-4' />)
      .with('Read', () => <BookCheck className='h-4 w-4' />)
      .with('Did Not Finish', () => <BookX className='h-4 w-4' />)
      .otherwise(() => <Bookmark className='h-4 w-4' />)
  }

  const handleRateBook = (rating: number) => {
    if (userRating?.rating !== rating) {
      const validRating = Math.min(
        Math.max(Math.round(rating), 1),
        5
      ) as RatingValue
      updateRatingMutation.mutate({ rating: validRating })
    }
  }

  if (isShelvesLoading) {
    return (
      <Button
        variant='ghost'
        size='icon'
        className='absolute right-1 top-1 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 opacity-50'
        disabled
      >
        <Bookmark className='h-4 w-4 animate-pulse' />
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className={cn(
            'absolute right-1 top-1 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90',
            'transition-opacity duration-200',
            isBookmarked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}
          aria-label={
            isBookmarked
              ? `${bookTitle} is on your shelf`
              : `Add ${bookTitle} to shelf`
          }
        >
          {getShelfIcon(currentShelf)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-64 p-0' align='end'>
        <div className='p-3 pb-2'>
          <h3 className='font-medium text-sm'>{bookTitle}</h3>
          <p className='text-xs text-muted-foreground mt-1'>
            Add to your shelves
          </p>
        </div>

        <div className='px-1 py-2'>
          <div className='space-y-1 px-2'>
            {DEFAULT_SYSTEM_SHELVES.map((shelf) => (
              <Button
                key={shelf}
                variant={currentShelf === shelf ? 'default' : 'ghost'}
                size='sm'
                className='w-full justify-start text-sm'
                onClick={() => {
                  try {
                    handleShelfSelect(shelf)
                    // Only close the popover if we're removing from the current shelf
                    // or if we're adding to a new shelf (not moving between shelves)
                    if (currentShelf === shelf || !currentShelf) {
                      setOpen(false)
                    }
                  } catch (error) {
                    console.error('Error selecting shelf:', error)
                    toast.error(`Failed to update shelf for "${bookTitle}"`)
                  }
                }}
                disabled={isShelfActionPending}
              >
                {match(shelf)
                  .with('Want to Read', () => (
                    <BookMarked className='mr-2 h-4 w-4' />
                  ))
                  .with('Currently Reading', () => (
                    <BookOpen className='mr-2 h-4 w-4' />
                  ))
                  .with('Read', () => <BookCheck className='mr-2 h-4 w-4' />)
                  .with('Did Not Finish', () => (
                    <BookX className='mr-2 h-4 w-4' />
                  ))
                  .otherwise(() => (
                    <Bookmark className='mr-2 h-4 w-4' />
                  ))}
                {shelf}
              </Button>
            ))}
          </div>

          <DropdownMenuSeparator className='my-2' />

          <div className='px-2 py-1'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-xs font-medium text-muted-foreground'>
                Rate this book
              </p>
              {userRating && (
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-5 w-5'
                  onClick={() => deleteRatingMutation.mutate(undefined)}
                  disabled={deleteRatingMutation.isPending}
                  title='Remove rating'
                >
                  <X className='h-3 w-3' />
                </Button>
              )}
            </div>
            <div className='flex items-center justify-center gap-1 py-1'>
              <BookRating
                size='lg'
                interactive
                rating={userRating?.rating}
                onRatingChange={handleRateBook}
                isLoading={updateRatingMutation.isPending}
              />
            </div>
            {averageRating && averageRating.totalRatings > 0 && (
              <div className='flex items-center justify-center mt-2'>
                <p className='text-xs text-muted-foreground'>
                  Average:{' '}
                  <span className='font-medium'>
                    {averageRating.averageRating.toFixed(1)}
                  </span>
                  <span className='ml-1'>
                    ({averageRating.totalRatings}{' '}
                    {averageRating.totalRatings === 1 ? 'rating' : 'ratings'})
                  </span>
                </p>
              </div>
            )}
          </div>

          <DropdownMenuSeparator className='my-2' />
        </div>
      </PopoverContent>
    </Popover>
  )
}
