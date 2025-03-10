'use client'

import {
  deleteShelfItem,
  getUserShelvesWithItems,
  upsertShelfItemWithShelfName
} from '@/app/actions/bookShelves.actions'
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
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { match } from 'ts-pattern'
import { BookRating } from './BookRating'

interface BookActionsProps {
  bookId: string
  editionId: string
  bookTitle: string
  currentShelf?: DefaultShelves[] | null
}

export function BookActions({
  bookId,
  editionId,
  bookTitle
}: BookActionsProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: userShelves, isLoading: isShelvesLoading } = useQuery({
    queryKey: ['userShelves'],
    queryFn: () => getUserShelvesWithItems(DEFAULT_SYSTEM_SHELVES),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    enabled: open
  })

  const { currentShelf, isBookmarked } = useMemo(() => {
    if (!userShelves) return { currentShelf: null, isBookmarked: false }

    const shelfWithBook = userShelves.find((shelf) =>
      shelf.items.some((item) => item.workId === bookId)
    )

    return {
      currentShelf: shelfWithBook?.name as DefaultShelves | null,
      isBookmarked: !!shelfWithBook
    }
  }, [userShelves, bookId])

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

  const addToShelfMutation = useMutation({
    mutationFn: (shelfName: DefaultShelves) =>
      upsertShelfItemWithShelfName({ workId: bookId }, shelfName),
    onSuccess: (_, shelfName) => {
      queryClient.invalidateQueries({ queryKey: ['userShelves'] })
      toast.success(`Added "${bookTitle}" to ${shelfName}`)
    },
    onError: (error) => {
      console.error('Failed to add book to shelf:', error)
      toast.error('Failed to add book to shelf')
    }
  })

  const removeFromShelfMutation = useMutation({
    mutationFn: async (shelfName: DefaultShelves) => {
      const shelf = userShelves?.find((s) => s.name === shelfName)
      if (!shelf) throw new Error(`Shelf ${shelfName} not found`)
      return deleteShelfItem(shelf.id, bookId)
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
    if (currentShelf === shelf) {
      removeFromShelfMutation.mutate(shelf)
      setOpen(false)
      return
    }

    if (currentShelf) {
      try {
        const currentShelfObj = userShelves?.find(
          (s) => s.name === currentShelf
        )
        if (currentShelfObj) {
          await deleteShelfItem(currentShelfObj.id, bookId)
          await upsertShelfItemWithShelfName({ workId: bookId }, shelf)
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

    addToShelfMutation.mutate(shelf)
    setOpen(false)
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
                  onClick={() => deleteRatingMutation.mutate()}
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

          <div className='px-2 py-1 space-y-1'>
            <Button
              variant='ghost'
              size='sm'
              className='w-full justify-start text-sm'
              onClick={() =>
                toast.info(
                  `Write review for "${bookTitle}" functionality coming soon`
                )
              }
            >
              Write a review...
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='w-full justify-start text-sm'
              onClick={() =>
                toast.info(
                  `Add "${bookTitle}" to list functionality coming soon`
                )
              }
            >
              Add to list...
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
