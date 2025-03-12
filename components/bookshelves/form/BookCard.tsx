import { BookEdition, BookWork } from '@/db/schema'
import { BookOpenIcon } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface BookCardProps {
  book: {
    edition: BookEdition
    work: BookWork
    authors: { id: string; name: string }[]
  }
  variant?: 'search' | 'selected'
  isSelected?: boolean
  onRemove?: () => void
  className?: string
}

export function BookCard({
  book,
  variant = 'selected',
  isSelected,
  onRemove,
  className
}: BookCardProps) {
  if (variant === 'search') {
    return (
      <div
        className={cn(
          'flex items-start gap-3 py-2.5 px-3 w-full transition-colors group',
          isSelected ? 'bg-accent/10' : 'hover:bg-accent/5',
          className
        )}
      >
        <div className='relative h-14 w-10 shrink-0 overflow-hidden rounded-sm border'>
          {book.edition.thumbnailUrl ? (
            <Image
              src={book.edition.thumbnailUrl}
              alt={book.work.title}
              fill
              className='object-cover'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center bg-muted'>
              <BookOpenIcon className='h-4 w-4' />
            </div>
          )}
        </div>
        <div className='min-w-0 flex-1'>
          <p className='text-sm font-medium text-foreground mb-1 line-clamp-1'>
            {book.work.title}
          </p>
          {book.authors.length > 0 && (
            <p className='text-xs text-white/70 group-hover:text-white line-clamp-1'>
              {book.authors.map((a) => a.name).join(', ')}
            </p>
          )}
        </div>
        {isSelected && (
          <Badge variant='secondary' className='shrink-0 ml-2 bg-accent/25'>
            Added
          </Badge>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group relative flex gap-3 rounded-lg border p-3 hover:bg-accent/50',
        className
      )}
    >
      {onRemove && (
        <button
          type='button'
          onClick={(e) => {
            e.preventDefault()
            onRemove()
          }}
          className='absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border bg-background opacity-0 shadow-sm transition-opacity hover:bg-accent group-hover:opacity-100'
        >
          <span className='sr-only'>Remove book</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='h-3 w-3'
          >
            <path d='M18 6 6 18' />
            <path d='m6 6 12 12' />
          </svg>
        </button>
      )}
      <div className='relative h-[120px] w-[80px] shrink-0 overflow-hidden rounded-md border'>
        {book.edition.thumbnailUrl ? (
          <Image
            src={book.edition.thumbnailUrl}
            alt={book.work.title}
            fill
            className='object-cover'
            sizes='80px'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-muted'>
            <BookOpenIcon className='h-8 w-8 text-muted-foreground' />
          </div>
        )}
      </div>
      <div className='min-w-0 flex-1'>
        <h4 className='font-medium leading-tight line-clamp-2'>
          {book.work.title}
        </h4>
        {book.authors.length > 0 && (
          <p className='mt-1 text-sm text-muted-foreground line-clamp-2'>
            {book.authors.map((a) => a.name).join(', ')}
          </p>
        )}
      </div>
    </div>
  )
}
