'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { UserPlus, UserCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AuthorFollowButtonProps {
  authorId: string
  initialFollowing?: boolean
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function AuthorFollowButton({
  authorId,
  initialFollowing = false,
  variant = 'outline',
  size = 'sm',
  className = ''
}: AuthorFollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const toggleFollow = async () => {
    try {
      setIsLoading(true)

      // This would be replaced with an actual API call in a real implementation
      console.log(`Toggling follow status for author: ${authorId}`)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setIsFollowing(!isFollowing)

      // In a real implementation, you would use a toast notification
      console.log(
        isFollowing
          ? `Author ${authorId} unfollowed`
          : `Author ${authorId} followed`
      )

      // Refresh the page to reflect changes
      router.refresh()
    } catch {
      // In a real implementation, you would use a toast notification
      console.error(
        `Failed to update follow status for author ${authorId}. Please try again.`
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={`gap-1.5 ${className}`}
      onClick={toggleFollow}
      disabled={isLoading}
    >
      {isFollowing ? (
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
