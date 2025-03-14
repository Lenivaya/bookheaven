'use client'

import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { deleteBook } from '@/app/actions/books.actions'

interface BookAdminActionsProps {
  editionId: string
  bookTitle: string
}

export function BookAdminActions({
  editionId,
  bookTitle
}: BookAdminActionsProps) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${bookTitle}"?`)) {
      return
    }

    try {
      const result = await deleteBook(editionId)
      if (result.success) {
        toast.success('Book deleted successfully')
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to delete book')
      }
    } catch (error) {
      toast.error('Failed to delete book')
      console.error('Error deleting book:', error)
    }
  }

  return (
    <div className='flex gap-2'>
      <Link href={`/forms/books?id=${editionId}`}>
        <Button
          variant='outline'
          size='sm'
          className='text-yellow-600 hover:text-yellow-700'
        >
          <Pencil className='h-4 w-4' />
          <span className='sr-only'>Edit book</span>
        </Button>
      </Link>
      <Button
        variant='outline'
        size='sm'
        className='text-red-600 hover:text-red-700'
        onClick={handleDelete}
      >
        <Trash2 className='h-4 w-4' />
        <span className='sr-only'>Delete book</span>
      </Button>
    </div>
  )
}
