import { Author } from '@/db/schema'
import AuthorCard from '../author-card/AuthorCard'

interface AuthorListProps {
  authors: Author[]
  followedAuthorIds?: string[]
}

export default function AuthorList({
  authors,
  followedAuthorIds = []
}: AuthorListProps) {
  if (!authors.length) {
    return (
      <div className='flex h-40 w-full items-center justify-center rounded-md border border-dashed p-8 text-center'>
        <div className='flex max-w-[420px] flex-col items-center justify-center'>
          <h3 className='mt-4 text-lg font-semibold'>No authors found</h3>
          <p className='mb-4 mt-2 text-sm text-muted-foreground'>
            We couldn&apos;t find any authors matching your criteria.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {authors.map((author) => (
        <AuthorCard
          key={author.id}
          author={author}
          isFollowing={followedAuthorIds.includes(author.id)}
        />
      ))}
    </div>
  )
}
