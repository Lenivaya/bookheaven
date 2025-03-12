'use client'

import { deleteShelf } from '@/app/actions/bookShelves.actions'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { TrashIcon } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface ShelfDeleteButtonProps {
  shelfId: string
  shelfUserId: string
}

export function ShelfDeleteButton({
  shelfId,
  shelfUserId
}: ShelfDeleteButtonProps) {
  const { userId } = useAuth()
  const router = useRouter()
  const isOwner = userId === shelfUserId

  if (!isOwner) {
    return null
  }

  async function handleDelete() {
    try {
      await deleteShelf(shelfId)
      toast.success('Bookshelf deleted successfully')
      router.refresh()
    } catch (error) {
      console.error('Error deleting shelf:', error)
      toast.error('Failed to delete bookshelf')
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='h-8 w-8 text-muted-foreground hover:text-destructive'
        >
          <TrashIcon className='h-4 w-4' />
          <span className='sr-only'>Delete shelf</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            bookshelf and remove all books from it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
