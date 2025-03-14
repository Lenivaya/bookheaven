import { BookEdition, BookWork, Tag } from '@/db/schema/books.schema'
import { Badge } from '@/components/ui/badge'
import { Link } from 'next-view-transitions'
import { format } from 'date-fns'
import {
  BookOpenIcon,
  CalendarIcon,
  LanguagesIcon,
  HashIcon,
  BuildingIcon
} from 'lucide-react'

interface BookInfoProps {
  book: BookEdition
  work: BookWork
  tags: Tag[]
}

export default function BookInfo({ book, work, tags }: BookInfoProps) {
  return (
    <div className='space-y-6'>
      {/* Description */}
      {work.description && (
        <div className='space-y-2'>
          <h2 className='text-xl font-semibold'>Description</h2>
          <div className='text-muted-foreground leading-relaxed prose prose-sm max-w-none whitespace-pre-line'>
            {work.description}
          </div>
        </div>
      )}

      {/* Publication details */}
      <div className='space-y-4'>
        <h2 className='text-xl font-semibold'>Details</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {book.publisher && (
            <div className='flex items-center gap-2'>
              <BuildingIcon className='w-5 h-5 text-muted-foreground' />
              <div>
                <div className='text-sm text-muted-foreground'>Publisher</div>
                <div>{book.publisher}</div>
              </div>
            </div>
          )}

          {book.publishedAt && (
            <div className='flex items-center gap-2'>
              <CalendarIcon className='w-5 h-5 text-muted-foreground' />
              <div>
                <div className='text-sm text-muted-foreground'>
                  Publication date
                </div>
                <div>{format(new Date(book.publishedAt), 'MMMM d, yyyy')}</div>
              </div>
            </div>
          )}

          {book.language && (
            <div className='flex items-center gap-2'>
              <LanguagesIcon className='w-5 h-5 text-muted-foreground' />
              <div>
                <div className='text-sm text-muted-foreground'>Language</div>
                <div>{book.language}</div>
              </div>
            </div>
          )}

          {work.originalLanguage && book.language !== work.originalLanguage && (
            <div className='flex items-center gap-2'>
              <LanguagesIcon className='w-5 h-5 text-muted-foreground' />
              <div>
                <div className='text-sm text-muted-foreground'>
                  Original language
                </div>
                <div>{work.originalLanguage}</div>
              </div>
            </div>
          )}

          {book.pageCount && (
            <div className='flex items-center gap-2'>
              <BookOpenIcon className='w-5 h-5 text-muted-foreground' />
              <div>
                <div className='text-sm text-muted-foreground'>Pages</div>
                <div>{book.pageCount}</div>
              </div>
            </div>
          )}

          {book.isbn && (
            <div className='flex items-center gap-2'>
              <HashIcon className='w-5 h-5 text-muted-foreground' />
              <div>
                <div className='text-sm text-muted-foreground'>ISBN</div>
                <div className='font-mono text-sm'>{book.isbn}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className='space-y-2'>
          <h2 className='text-xl font-semibold'>Genres</h2>
          <div className='flex flex-wrap gap-2'>
            {tags.map((tag) => (
              <Link href={`/books?tags=${tag.id}`} key={tag.id}>
                <Badge
                  variant='secondary'
                  className='text-sm hover:bg-secondary/80 transition-colors'
                >
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
