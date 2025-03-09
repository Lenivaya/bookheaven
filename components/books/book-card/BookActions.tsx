'use client'

import { match } from 'ts-pattern'
import { useState, useMemo } from 'react'
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
  getBookAverageRating
} from '@/app/actions/ratings.actions'
import {
  upsertShelfItemWithShelfName,
  deleteShelfItem,
  getUserShelvesWithItems
} from '@/app/actions/bookShelves.actions'

// Define the valid rating values
type RatingValue = 1 | 2 | 3 | 4 | 5

// All available shelves
const AVAILABLE_SHELVES: DefaultShelves[] = [
  'Want to Read',
  'Currently Reading',
  'Read',
  'Did Not Finish'
]

interface BookActionsProps {
  bookId: string
  editionId: string
  bookTitle: string
  currentShelf?: DefaultShelves | null
}

export function BookActions({
  bookId,
  editionId,
  bookTitle
}: BookActionsProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  // Query to get all user shelves with their items - this can be shared across all book cards
  const { data: userShelves, isLoading: isShelvesLoading } = useQuery({
    queryKey: ['userShelves'],
    queryFn: async () => {
      return getUserShelvesWithItems(AVAILABLE_SHELVES)
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  // Use memoized computation to determine which shelf the book is in
  const { currentShelf, isBookmarked } = useMemo(() => {
    if (!userShelves) {
      return { currentShelf: null, isBookmarked: false }
    }

    // Find the shelf that contains this book
    const shelfWithBook = userShelves.find((shelf) =>
      shelf.items.some((item) => item.workId === bookId)
    )

    return {
      currentShelf: shelfWithBook?.name as DefaultShelves | null,
      isBookmarked: !!shelfWithBook
    }
  }, [userShelves, bookId])

  // Query to get the user's current rating for this book
  const { data: userRating, isLoading: isRatingLoading } = useQuery({
    queryKey: ['userRating', editionId],
    queryFn: async () => {
      const rating = await getUserRating(editionId)
      return rating
    },
    refetchOnWindowFocus: false
  })

  // Query to get the book's average rating
  const { data: averageRating } = useQuery({
    queryKey: ['averageRating', editionId],
    queryFn: async () => {
      const rating = await getBookAverageRating(editionId)
      return rating
    },
    refetchOnWindowFocus: false
  })

  // Mutation to add book to shelf
  const addToShelfMutation = useMutation({
    mutationFn: async (shelfName: DefaultShelves) => {
      await upsertShelfItemWithShelfName({ workId: bookId }, shelfName)
    },
    onSuccess: (_, shelfName) => {
      queryClient.invalidateQueries({ queryKey: ['userShelves'] })
      toast.success(`Added "${bookTitle}" to ${shelfName}`)
    },
    onError: (error) => {
      console.error('Failed to add book to shelf:', error)
      toast.error('Failed to add book to shelf')
    }
  })

  // Mutation to remove book from shelf
  const removeFromShelfMutation = useMutation({
    mutationFn: async (shelfName: DefaultShelves) => {
      // Find the shelf ID from our cached shelves data
      const shelf = userShelves?.find((s) => s.name === shelfName)

      if (!shelf) {
        throw new Error(`Shelf ${shelfName} not found`)
      }

      await deleteShelfItem(shelf.id, bookId)
    },
    onSuccess: (_, shelfName) => {
      queryClient.invalidateQueries({ queryKey: ['userShelves'] })
      toast.success(`Removed "${bookTitle}" from ${shelfName}`)
    },
    onError: (error) => {
      console.error('Failed to remove book from shelf:', error)
      toast.error('Failed to remove book from shelf')
    }
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
    // If the shelf is already selected, remove the book from it
    if (currentShelf === shelf) {
      removeFromShelfMutation.mutate(shelf)
      setOpen(false)
      return
    }

    // If the book is already on a different shelf, we need to remove it first
    if (currentShelf) {
      try {
        // Find the current shelf object
        const currentShelfObj = userShelves?.find(
          (s) => s.name === currentShelf
        )

        if (currentShelfObj) {
          // First remove from current shelf
          await deleteShelfItem(currentShelfObj.id, bookId)

          // Then add to the new shelf
          await upsertShelfItemWithShelfName({ workId: bookId }, shelf)

          // Update UI and show success message
          queryClient.invalidateQueries({ queryKey: ['userShelves'] })
          toast.success(`Moved "${bookTitle}" from ${currentShelf} to ${shelf}`)
          setOpen(false)
          return
        }
      } catch (error) {
        console.error('Failed to move book between shelves:', error)
        toast.error('Failed to move book between shelves')
        return
      }
    }

    // Otherwise, just add the book to the new shelf
    addToShelfMutation.mutate(shelf)
    setOpen(false)
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

  // Loading state for the entire component
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
            {AVAILABLE_SHELVES.map((shelf) => (
              <Button
                key={shelf}
                variant={currentShelf === shelf ? 'default' : 'ghost'}
                size='sm'
                className='w-full justify-start text-sm'
                onClick={() => handleShelfSelect(shelf)}
                disabled={
                  addToShelfMutation.isPending ||
                  removeFromShelfMutation.isPending
                }
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
