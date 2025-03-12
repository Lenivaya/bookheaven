'use client'

import { bookSearchParamsSchema } from '@/app/books/searchParams'
import { Badge } from '@/components/ui/badge'
import { Author } from '@/db/schema'
import { useQueryStates } from 'nuqs'

interface ClientAuthorsInteractionProps {
  authors: Author[]
}

export function ClientAuthorsInteraction({
  authors
}: ClientAuthorsInteractionProps) {
  const [{ authors: queryAuthors }, setSearchParams] = useQueryStates(
    bookSearchParamsSchema,
    {
      shallow: false
    }
  )

  const handleAuthorClick = (authorId: string) => {
    const authorAlreadySelected = queryAuthors.includes(authorId)
    if (authorAlreadySelected) {
      setSearchParams({
        authors: queryAuthors.filter((id) => id !== authorId)
      })
    } else {
      setSearchParams({ authors: [authorId, ...queryAuthors] })
    }
  }

  return (
    <div className='flex flex-wrap gap-1.5'>
      {authors.map((author) => (
        <Badge
          key={author.id}
          variant='outline'
          className='cursor-pointer text-xs px-2 py-0.5 border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-colors duration-200 dark:border-primary/30 dark:hover:bg-primary/10'
          onClick={() => handleAuthorClick(author.id)}
        >
          {author.name}
        </Badge>
      ))}
    </div>
  )
}
