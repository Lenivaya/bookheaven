import { Author } from '@/db/schema'
import AuthorCard from '../author-card/AuthorCard'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const authorListVariants = cva('grid gap-4', {
  variants: {
    layout: {
      default: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      compact: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      narrow: 'grid-cols-1 sm:grid-cols-2',
      single: 'grid-cols-1'
    }
  },
  defaultVariants: {
    layout: 'default'
  }
})

interface AuthorListProps extends VariantProps<typeof authorListVariants> {
  authors: Author[]
  followedAuthorIds?: string[]
  className?: string
  showAdminActions?: boolean
}

export default function AuthorList({
  authors,
  followedAuthorIds = [],
  layout,
  className,
  showAdminActions = false
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
    <div className={cn(authorListVariants({ layout }), className)}>
      {authors.map((author) => (
        <AuthorCard
          key={author.id}
          author={author}
          isFollowing={followedAuthorIds.includes(author.id)}
          showAdminActions={showAdminActions}
        />
      ))}
    </div>
  )
}
