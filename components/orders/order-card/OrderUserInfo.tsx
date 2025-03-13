'use client'

import * as React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { useUser } from '@/hooks/use-user'

interface OrderUserInfoProps {
  userId: string
  createdAt: Date
}

export function OrderUserInfo({ userId, createdAt }: OrderUserInfoProps) {
  const { data: user, isLoading } = useUser(userId)

  if (isLoading || !user) {
    return (
      <div className='flex items-center gap-2'>
        <Avatar className='h-5 w-5'>
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
        <div className='space-y-0.5'>
          <p className='text-xs font-medium leading-none animate-pulse bg-muted rounded w-16 h-3' />
          <p className='text-xs text-muted-foreground animate-pulse bg-muted rounded w-12 h-3' />
        </div>
      </div>
    )
  }

  return (
    <div className='flex items-center gap-2'>
      <Avatar className='h-5 w-5'>
        <AvatarImage
          src={user.imageUrl ?? undefined}
          alt={user.firstName ?? ''}
        />
        <AvatarFallback>{user.username}</AvatarFallback>
      </Avatar>
      <div className='space-y-0.5'>
        <p className='text-xs font-medium leading-none text-muted-foreground'>
          {user.firstName}
        </p>
        <p className='text-xs text-muted-foreground/75'>
          {formatDistanceToNow(createdAt, { addSuffix: true })}
        </p>
      </div>
    </div>
  )
}
