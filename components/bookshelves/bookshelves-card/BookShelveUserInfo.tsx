'use client'

import * as React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { useUser } from '@/hooks/use-user'

interface BookShelveUserInfoProps {
  userId: string
  createdAt: Date
}

export function BookShelveUserInfo({
  userId,
  createdAt
}: BookShelveUserInfoProps) {
  const { data: user, isLoading } = useUser(userId)

  if (isLoading || !user) {
    return (
      <div className='flex items-center space-x-2'>
        <Avatar className='h-8 w-8'>
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
        <div className='space-y-1'>
          <p className='text-sm font-medium leading-none animate-pulse bg-muted rounded w-24 h-4' />
          <p className='text-sm text-muted-foreground animate-pulse bg-muted rounded w-16 h-4' />
        </div>
      </div>
    )
  }

  return (
    <div className='flex items-center space-x-2'>
      <Avatar className='h-8 w-8'>
        <AvatarImage
          src={user.imageUrl ?? undefined}
          alt={user.firstName ?? ''}
        />
        <AvatarFallback>{user.username}</AvatarFallback>
      </Avatar>
      <div className='space-y-1'>
        <p className='text-sm font-medium leading-none'>{user.firstName}</p>
        <p className='text-sm text-muted-foreground'>
          {formatDistanceToNow(createdAt, { addSuffix: true })}
        </p>
      </div>
    </div>
  )
}
