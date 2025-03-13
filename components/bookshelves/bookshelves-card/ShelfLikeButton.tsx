'use client'

import {
  hasLikedShelf,
  toggleShelfLike
} from '@/app/actions/bookShelves.actions'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Heart } from 'lucide-react'
import { toast } from 'sonner'

interface ShelfLikeButtonProps {
  shelfId: string
  likesCount: number
}

export function ShelfLikeButton({ shelfId, likesCount }: ShelfLikeButtonProps) {
  const queryClient = useQueryClient()

  const { data: isLiked = false, isLoading: isLikeStatusLoading } = useQuery({
    queryKey: ['isLikedShelf', shelfId],
    queryFn: () => hasLikedShelf(shelfId)
  })

  const likeMutation = useMutation({
    mutationFn: () => toggleShelfLike(shelfId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['isLikedShelf', shelfId]
      })
    },
    onError: () => {
      toast.error('Failed to update like status. Please try again.')
    }
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
        <span className='text-xs font-medium'>{likesCount}</span>
        <span className='sr-only'>{isLiked ? 'Unlike' : 'Like'} shelf</span>
      </Button>
    </div>
  )
}
