'use client'

import { Button } from '@/components/ui/button'
import { PencilIcon } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'
import { Link } from 'next-view-transitions'

interface ShelfEditButtonProps {
  shelfId: string
  shelfUserId: string
}

export function ShelfEditButton({
  shelfId,
  shelfUserId
}: ShelfEditButtonProps) {
  const { userId } = useAuth()
  const isOwner = userId === shelfUserId

  if (!isOwner) {
    return null
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      className='h-8 w-8 text-muted-foreground hover:text-primary'
      asChild
    >
      <Link href={`/forms/book-shelves?id=${shelfId}`}>
        <PencilIcon className='h-4 w-4' />
        <span className='sr-only'>Edit shelf</span>
      </Link>
    </Button>
  )
}
