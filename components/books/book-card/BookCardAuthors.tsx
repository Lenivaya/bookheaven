'use client'
import { bookSearchParamsSchema } from '@/app/books/searchParams'
import { Badge } from '@/components/ui/badge'
import { Author } from '@/db/schema'
import { useQueryStates } from 'nuqs'

export function BookCardAuthors({ authors }: { authors: Author[] }) {
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
    <p className='line-clamp-1 text-xs text-muted-foreground dark:text-slate-400'>
      {/* {authors.map((author) => author.name).join(', ')} */}
      {authors.map((author) => (
        <Badge
          key={author.id}
          variant='outline'
          className='cursor-pointer'
          onClick={() => handleAuthorClick(author.id)}
        >
          {author.name}
        </Badge>
      ))}
    </p>
  )
}
