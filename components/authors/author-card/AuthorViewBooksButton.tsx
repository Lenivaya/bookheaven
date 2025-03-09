'use client'

import { Button } from '@/components/ui/button'
import { BookOpenIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AuthorViewBooksButtonProps {
  authorId: string
}

export function AuthorViewBooksButton({
  authorId
}: AuthorViewBooksButtonProps) {
  const router = useRouter()

  // Navigate to books by this author
  const viewAuthorBooks = () => {
    router.push(`/books?authors=${authorId}`)
  }

  return (
    <Button
      variant='outline'
      size='sm'
      className='gap-1.5'
      onClick={viewAuthorBooks}
    >
      <BookOpenIcon className='h-4 w-4' />
      <span>View Books</span>
    </Button>
  )
}
