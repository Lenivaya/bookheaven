'use client'

import { Button } from '@/components/ui/button'
import { UserPlus, UserCheck, Loader2 } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  followAuthor,
  unfollowAuthor,
  isFollowingAuthor
} from '@/app/actions/followers.actions'
import { cn } from '@/lib/utils'

interface AuthorFollowButtonProps {
  authorId: string
  initialFollowing?: boolean
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function AuthorFollowButton({
  authorId,
  initialFollowing = false,
  size = 'sm',
  className = ''
}: AuthorFollowButtonProps) {
  const queryClient = useQueryClient()
  const followQueryKey = ['author', authorId, 'following']

  // Fetch the current follow status
  const { data: isFollowing, isLoading } = useQuery({
    queryKey: followQueryKey,
    queryFn: async () => {
      try {
        return await isFollowingAuthor(authorId)
      } catch {
        return initialFollowing
      }
    },
    initialData: initialFollowing
  })

  // Combined mutation for toggling follow status
  const mutation = useMutation({
    mutationFn: async () => {
      if (isFollowing) {
        await unfollowAuthor(authorId)
        return false
      } else {
        await followAuthor(authorId)
        return true
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: followQueryKey })
      const previousValue = queryClient.getQueryData(followQueryKey)
      const newValue = !isFollowing
      queryClient.setQueryData(followQueryKey, newValue)
      return { previousValue }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(followQueryKey, context?.previousValue)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: followQueryKey })
    }
  })

  const isPending = mutation.isPending || isLoading

  return (
    <Button
      variant={isFollowing ? 'default' : 'outline'}
      size={size}
      className={cn(
        'gap-1.5 transition-all duration-200',
        isFollowing && 'bg-primary text-primary-foreground hover:bg-primary/90',
        className
      )}
      onClick={() => mutation.mutate()}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className='h-4 w-4 animate-spin' />
      ) : isFollowing ? (
        <>
          <UserCheck className='h-4 w-4' />
          <span>Following</span>
        </>
      ) : (
        <>
          <UserPlus className='h-4 w-4' />
          <span>Follow</span>
        </>
      )}
    </Button>
  )
}
