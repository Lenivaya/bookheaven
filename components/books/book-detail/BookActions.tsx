'use client'

import { Button } from '@/components/ui/button'
import {
  BookCheck,
  BookMarked,
  BookOpen,
  BookX,
  Bookmark,
  ListPlusIcon,
  Share2Icon,
  StarIcon,
  X
} from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  deleteShelfItem,
  getUserShelvesWithItems,
  upsertShelfItemWithShelfName
} from '@/app/actions/bookShelves.actions'
import { DEFAULT_SYSTEM_SHELVES, DefaultShelves } from '@/lib/constants'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { match } from 'ts-pattern'
import { BookRating } from '@/components/books/book-card/BookRating'
import {
  deleteBookRating,
  getBookEditionAverageRating,
  getUserRating,
  upsertBookRating
} from '@/app/actions/ratings.actions'
import { RatingValue } from '@/db/schema/ratings.schema'

interface BookActionsProps {
  editionId: string
}

export default function BookActions({ editionId }: BookActionsProps) {
  const [isBookmarkOpen, setIsBookmarkOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: userShelves, isLoading: isShelvesLoading } = useQuery({
    queryKey: ['userShelves'],
    queryFn: () => getUserShelvesWithItems(DEFAULT_SYSTEM_SHELVES),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000
  })

  const { currentShelf, isBookmarked } = useMemo(() => {
    if (!userShelves) return { currentShelf: null, isBookmarked: false }

    const shelfWithBook = userShelves.find((shelf) =>
      shelf.items.some((item) => item.editionId === editionId)
    )

    return {
      currentShelf: shelfWithBook?.name as DefaultShelves | null,
      isBookmarked: !!shelfWithBook
    }
  }, [userShelves, editionId])

  const addToShelfMutation = useMutation({
    mutationFn: (shelfName: DefaultShelves) =>
      upsertShelfItemWithShelfName({ editionId }, shelfName),
    onSuccess: (_, shelfName) => {
      queryClient.invalidateQueries({ queryKey: ['userShelves'] })
      toast.success(`Added to ${shelfName}`)
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
      return deleteShelfItem(shelf.id, editionId)
    },
    onSuccess: (_, shelfName) => {
      queryClient.invalidateQueries({ queryKey: ['userShelves'] })
      toast.success(`Removed from ${shelfName}`)
    },
    onError: (error) => {
      console.error('Failed to remove book from shelf:', error)
      toast.error('Failed to remove book from shelf')
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
      setIsBookmarkOpen(false)
      return
    }

    if (currentShelf) {
      try {
        const currentShelfObj = userShelves?.find(
          (s) => s.name === currentShelf
        )
        if (currentShelfObj) {
          await deleteShelfItem(currentShelfObj.id, editionId)
          await upsertShelfItemWithShelfName({ editionId }, shelf)
          queryClient.invalidateQueries({ queryKey: ['userShelves'] })
          toast.success(`Moved from ${currentShelf} to ${shelf}`)
          setIsBookmarkOpen(false)
          return
        }
      } catch (error) {
        console.error('Failed to move book between shelves:', error)
        toast.error('Failed to move book between shelves')
        return
      }
    }

    addToShelfMutation.mutate(shelf)
    setIsBookmarkOpen(false)
  }

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-2 gap-3'>
        <Popover open={isBookmarkOpen} onOpenChange={setIsBookmarkOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={isBookmarked ? 'default' : 'outline'}
              className={cn(
                'w-full transition-all',
                isBookmarked && 'bg-primary text-primary-foreground'
              )}
              disabled={isShelvesLoading}
            >
              {isShelvesLoading ? (
                <Bookmark className='w-4 h-4 mr-2 animate-pulse' />
              ) : (
                getShelfIcon(currentShelf)
              )}
              <span className='ml-2'>
                {isBookmarked ? currentShelf : 'Want to Read'}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-64 p-0' align='start'>
            <div className='p-3 pb-2'>
              <h3 className='font-medium text-sm'>Add to your shelves</h3>
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
                      .with('Read', () => (
                        <BookCheck className='mr-2 h-4 w-4' />
                      ))
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
            </div>
          </PopoverContent>
        </Popover>

        <RatingPopover editionId={editionId} />
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

function RatingPopover({ editionId }: { editionId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: userRating } = useQuery({
    queryKey: ['userRating', editionId],
    queryFn: () => getUserRating(editionId),
    refetchOnWindowFocus: false
  })

  const { data: averageRating } = useQuery({
    queryKey: ['averageRating', editionId],
    queryFn: () => getBookEditionAverageRating(editionId),
    refetchOnWindowFocus: false
  })

  const updateRatingMutation = useMutation({
    mutationFn: ({ rating }: { rating: RatingValue }) =>
      upsertBookRating(editionId, rating),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userRating', editionId] })
      queryClient.invalidateQueries({ queryKey: ['averageRating', editionId] })
      toast.success(`Rated with ${variables.rating} stars`)
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
      toast.success(`Removed rating`)
    },
    onError: (error) => {
      console.error('Failed to delete rating:', error)
      toast.error('Failed to delete rating')
    }
  })

  const handleRateBook = (rating: number) => {
    if (userRating?.rating !== rating) {
      const validRating = Math.min(
        Math.max(Math.round(rating), 1),
        5
      ) as RatingValue
      updateRatingMutation.mutate({ rating: validRating })
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={userRating ? 'default' : 'outline'}
          className={cn(
            'w-full transition-all',
            userRating &&
              'bg-yellow-500/90 hover:bg-yellow-500 text-white border-yellow-500'
          )}
        >
          <StarIcon
            className={cn(
              'w-4 h-4 mr-2 transition-all',
              userRating && 'fill-white'
            )}
          />
          {userRating ? `Rated ${userRating.rating}` : 'Rate'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-4'>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <h4 className='font-medium'>Rate this book</h4>
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
          <div className='flex justify-center gap-1 py-1'>
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
      </PopoverContent>
    </Popover>
  )
}
