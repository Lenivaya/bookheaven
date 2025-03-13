'use client'

import { Heart } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { hasLikedBook, toggleBookLike } from '@/app/actions/books.actions'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface LikeButtonProps {
  bookEditionId: string
  isHovering: boolean
}

export function LikeButton({ bookEditionId, isHovering }: LikeButtonProps) {
  const queryClient = useQueryClient()

  const { data: isLiked = false, isLoading: isLikeStatusLoading } = useQuery({
    queryKey: ['isLikedBook', bookEditionId],
    queryFn: () => hasLikedBook(bookEditionId)
  })

  const likeMutation = useMutation({
    mutationFn: () => toggleBookLike(bookEditionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['isLikedBook', bookEditionId]
      })
    }
  })

  // Show the button if hovering or if the book is already liked
  const shouldShow = isHovering || isLiked

  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none',
        // Only hide the button if not liked AND not hovering
        !isLiked && !isHovering ? 'opacity-0' : 'opacity-100'
      )}
    >
      <Button
        size='icon'
        variant='ghost'
        className={cn(
          'absolute bottom-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm pointer-events-auto',
          'hover:bg-background/90 transition-all duration-200',
          isLiked
            ? 'text-red-500 hover:text-red-600'
            : 'text-muted-foreground hover:text-foreground'
        )}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          likeMutation.mutate()
        }}
        disabled={likeMutation.isPending || isLikeStatusLoading}
      >
        {likeMutation.isPending ? (
          <span className='h-4 w-4 animate-pulse' />
        ) : (
          <Heart
            className={cn(
              'h-4 w-4 transition-all',
              isLiked ? 'fill-current' : 'fill-none'
            )}
          />
        )}
        <span className='sr-only'>{isLiked ? 'Unlike' : 'Like'} book</span>
      </Button>
    </div>
  )
}
