'use client'

import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { Link } from 'next-view-transitions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { deleteAuthor } from '@/app/actions/authors'

interface AuthorAdminActionsProps {
  authorId: string
  authorName: string
}

export function AuthorAdminActions({
  authorId,
  authorName
}: AuthorAdminActionsProps) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${authorName}?`)) {
      return
    }

    try {
      const result = await deleteAuthor(authorId)
      if (result.success) {
        toast.success('Author deleted successfully')
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to delete author')
      }
    } catch (error) {
      toast.error('Failed to delete author')
      console.error('Error deleting author:', error)
    }
  }

  return (
    <div className='flex gap-2'>
      <Link href={`/forms/authors?id=${authorId}`}>
        <Button
          variant='outline'
          size='sm'
          className='text-yellow-600 hover:text-yellow-700'
        >
          <Pencil className='h-4 w-4' />
          <span className='sr-only'>Edit author</span>
        </Button>
      </Link>
      <Button
        variant='outline'
        size='sm'
        className='text-red-600 hover:text-red-700'
        onClick={handleDelete}
      >
        <Trash2 className='h-4 w-4' />
        <span className='sr-only'>Delete author</span>
      </Button>
    </div>
  )
}
