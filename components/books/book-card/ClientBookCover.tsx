import { Badge } from '@/components/ui/badge'
import { Protect } from '@clerk/nextjs'
import { Link } from 'next-view-transitions'

import { BookActions } from './BookActions'
import { BookCoverImage } from './BookCoverImage'

interface ClientBookCoverProps {
  thumbnailUrl: string | null
  title: string
  editionId: string
  isOnSale: boolean
}

export function ClientBookCover({
  thumbnailUrl,
  title,
  editionId,
  isOnSale
}: ClientBookCoverProps) {
  return (
    <>
      <Link
        href={`/books/${editionId}`}
        className='block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
      >
        <BookCoverImage
          thumbnailUrl={thumbnailUrl}
          title={title}
          bookEditionId={editionId}
        />
      </Link>

      {/* Book Actions Component */}
      <Protect>
        <BookActions editionId={editionId} bookTitle={title} />
      </Protect>

      {isOnSale && (
        <div className='absolute right-0 top-0 z-10'>
          <Badge
            variant='destructive'
            className='rounded-none rounded-bl-sm px-1.5 py-0.5 text-[10px] font-medium'
          >
            Sale
          </Badge>
        </div>
      )}
    </>
  )
}
