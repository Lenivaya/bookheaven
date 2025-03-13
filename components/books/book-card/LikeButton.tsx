'use client'

import { Heart } from 'lucide-react'
import { hasLikedBook, toggleBookLike } from '@/app/actions/books.actions'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useLikeOptimistic } from '@/hooks/useLikeOptimistic'

interface LikeButtonProps {
  bookEditionId: string
  isHovering: boolean
}

export function LikeButton({ bookEditionId, isHovering }: LikeButtonProps) {
  const { isLiked, isLikeStatusLoading, likeMutation } = useLikeOptimistic({
    itemId: bookEditionId,
    queryKeyPrefix: 'isLikedBook',
    checkLikeStatusFn: hasLikedBook,
    toggleLikeFn: () => toggleBookLike(bookEditionId)
  })

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
          likeMutation.mutate(undefined)
        }}
        disabled={isLikeStatusLoading}
      >
        {likeMutation.isPending ? (
          <Heart
            className={cn(
              'h-4 w-4 transition-all animate-pulse',
              // Still show the appropriate fill state during pending mutations
              isLiked ? 'fill-current' : 'fill-none'
            )}
          />
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
