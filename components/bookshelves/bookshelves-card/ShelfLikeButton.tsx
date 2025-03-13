'use client'

import {
  hasLikedShelf,
  toggleShelfLike
} from '@/app/actions/bookShelves.actions'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Heart } from 'lucide-react'
import { useLikeOptimistic } from '@/hooks/useLikeOptimistic'

interface ShelfLikeButtonProps {
  shelfId: string
  likesCount: number
}

export function ShelfLikeButton({ shelfId, likesCount }: ShelfLikeButtonProps) {
  const { isLiked, isLikeStatusLoading, likeMutation, optimisticLikesCount } =
    useLikeOptimistic({
      itemId: shelfId,
      initialLikesCount: likesCount,
      queryKeyPrefix: 'isLikedShelf',
      checkLikeStatusFn: hasLikedShelf,
      toggleLikeFn: () => toggleShelfLike(shelfId)
    })

  return (
    <div className='flex items-center gap-1.5'>
      <Button
        size='sm'
        variant='ghost'
        className={cn(
          'flex items-center gap-1.5 h-8 px-2 rounded-md transition-all duration-200',
          isLiked
            ? 'text-red-500 hover:text-red-600 hover:bg-red-100/10'
            : 'text-muted-foreground hover:text-foreground'
        )}
        onClick={() => {
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
        <span className='text-xs font-medium'>{optimisticLikesCount}</span>
        <span className='sr-only'>{isLiked ? 'Unlike' : 'Like'} shelf</span>
      </Button>
    </div>
  )
}
