'use client'

import { match } from 'ts-pattern'
import { useState } from 'react'
import {
  Bookmark,
  BookOpen,
  BookMarked,
  BookCheck,
  BookX,
  X
} from 'lucide-react'
import { DefaultShelves } from '@/app/actions/bookShelves.actions'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { BookRating } from './BookRating'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getUserRating,
  upsertBookRating,
  deleteBookRating,
  getBookAverageRating,
  RatingValue
} from '@/app/actions/ratings.actions'

interface BookActionsProps {
  bookId: string
  editionId: string
  bookTitle: string
  currentShelf?: DefaultShelves | null
}

export function BookActions({
  bookId,
  editionId,
  bookTitle,
  currentShelf: initialShelf
}: BookActionsProps) {
  const [isBookmarked, setIsBookmarked] = useState(!!initialShelf)
  const [currentShelf, setCurrentShelf] = useState<DefaultShelves | null>(
    initialShelf || null
  )
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  // Query to get the user's current rating for this book
  const { data: userRating, isLoading: isRatingLoading } = useQuery({
    queryKey: ['userRating', editionId],
    queryFn: async () => {
      const rating = await getUserRating(editionId)
      return rating
    },
    // Don't refetch on window focus to avoid flickering
    refetchOnWindowFocus: false
  })

  // Query to get the book's average rating
  const { data: averageRating } = useQuery({
    queryKey: ['averageRating', editionId],
    queryFn: async () => {
      const rating = await getBookAverageRating(editionId)
      return rating
    },
    // Don't refetch on window focus to avoid flickering
    refetchOnWindowFocus: false
  })

  // Mutation to update a book rating
  const updateRatingMutation = useMutation({
    mutationFn: async ({ rating }: { rating: RatingValue }) => {
      await upsertBookRating(editionId, rating)
    },
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

  // Mutation to delete a book rating
  const deleteRatingMutation = useMutation({
    mutationFn: async () => {
      await deleteBookRating(editionId)
    },
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

  // Function to get the appropriate icon based on shelf type
  const getShelfIcon = (shelf: DefaultShelves | null) => {
    if (!shelf) return <Bookmark className='h-4 w-4' />

    return match(shelf)
      .with('Want to Read', () => <BookMarked className='h-4 w-4' />)
      .with('Currently Reading', () => <BookOpen className='h-4 w-4' />)
      .with('Read', () => <BookCheck className='h-4 w-4' />)
      .with('Did Not Finish', () => <BookX className='h-4 w-4' />)
      .otherwise(() => <Bookmark className='h-4 w-4' />)
  }

  const handleShelfSelect = async (shelf: DefaultShelves) => {
    // If the shelf is already selected, unselect it
    if (currentShelf === shelf) {
      setCurrentShelf(null)
      setIsBookmarked(false)
      setOpen(false)

      // Here you would call your server action to remove the book from the shelf
      // Example: await deleteShelfItem(shelf, bookId)
      console.log(`Removing book ${bookId} from shelf: ${shelf}`)

      toast.success(`Removed "${bookTitle}" from ${shelf}`)
      return
    }

    // Otherwise, select the new shelf
    setCurrentShelf(shelf)
    setIsBookmarked(true)
    setOpen(false)

    // Here you would call your server action to update the shelf
    // Example: await upsertShelfItem({ shelfId: shelf, workId: bookId })
    console.log(`Adding book ${bookId} to shelf: ${shelf}`)

    toast.success(`Added "${bookTitle}" to ${shelf}`)
  }

  const handleRateBook = (rating: number) => {
    // Only update if the rating is different from the current one
    if (userRating?.rating !== rating) {
      // Ensure rating is a valid RatingValue (1-5)
      const validRating = Math.min(
        Math.max(Math.round(rating), 1),
        5
      ) as RatingValue
      updateRatingMutation.mutate({ rating: validRating })
    }
  }

  const handleDeleteRating = () => {
    if (userRating) {
      deleteRatingMutation.mutate()
    }
  }

  const handleAddToList = () => {
    // Here you would open a modal or navigate to add to list page
    console.log(`Adding book ${bookId} to list`)

    toast.info(`Add "${bookTitle}" to list functionality coming soon`)
  }

  const handleWriteReview = () => {
    // Here you would navigate to review page or open a modal
    console.log(`Writing review for book ${bookId}`)

    toast.info(`Write review for "${bookTitle}" functionality coming soon`)
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
            // Show by default if bookmarked, otherwise only on parent hover
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
          {/* Shelves section */}
          <div className='space-y-1 px-2'>
            {(
              [
                'Want to Read',
                'Currently Reading',
                'Read',
                'Did Not Finish'
              ] as DefaultShelves[]
            ).map((shelf) => (
              <Button
                key={shelf}
                variant={currentShelf === shelf ? 'default' : 'ghost'}
                size='sm'
                className='w-full justify-start text-sm'
                onClick={() => handleShelfSelect(shelf)}
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

          {/* Rating section */}
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
                  onClick={handleDeleteRating}
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
                isLoading={isRatingLoading || updateRatingMutation.isPending}
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

          {/* Additional actions */}
          <div className='px-2 py-1 space-y-1'>
            <Button
              variant='ghost'
              size='sm'
              className='w-full justify-start text-sm'
              onClick={handleWriteReview}
            >
              Write a review...
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='w-full justify-start text-sm'
              onClick={handleAddToList}
            >
              Add to list...
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
