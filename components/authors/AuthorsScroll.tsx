import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Author } from '@/db/schema'
import { HorizontalAuthorCard } from './CompactAuthorCard'

interface AuthorsScrollProps {
  authors: (Author & { bookCount?: number })[]
  className?: string
  title?: string
  showScrollButtons?: boolean
}

/**
 * A component for horizontal scrolling author lists
 */
export function AuthorsScroll({
  authors,
  className,
  title,
  showScrollButtons = true
}: AuthorsScrollProps) {
  // Function to handle scrolling left
  const scrollLeft = () => {
    const container = document.getElementById('authors-scroll-container')
    if (container) {
      container.scrollBy({ left: -250, behavior: 'smooth' })
    }
  }

  // Function to handle scrolling right
  const scrollRight = () => {
    const container = document.getElementById('authors-scroll-container')
    if (container) {
      container.scrollBy({ left: 250, behavior: 'smooth' })
    }
  }

  if (authors.length === 0) {
    return null
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Title and scroll buttons */}
      {(title || showScrollButtons) && (
        <div className='flex items-center justify-between mb-4'>
          {title && (
            <h2 className='text-xl font-semibold tracking-tight'>{title}</h2>
          )}

          {showScrollButtons && (
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='icon'
                className='h-8 w-8 rounded-full'
                onClick={scrollLeft}
                aria-label='Scroll left'
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                className='h-8 w-8 rounded-full'
                onClick={scrollRight}
                aria-label='Scroll right'
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Scrollable container */}
      <div
        id='authors-scroll-container'
        className='flex overflow-x-auto pb-4 gap-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/30 scroll-smooth'
      >
        {authors.map((author) => (
          <HorizontalAuthorCard
            key={author.id}
            author={author}
            bookCount={author.bookCount}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * A grid layout for author cards
 */
export function AuthorsGrid({
  authors,
  className,
  title
}: Omit<AuthorsScrollProps, 'showScrollButtons'>) {
  if (authors.length === 0) {
    return null
  }

  return (
    <div className={cn('w-full', className)}>
      {title && (
        <h2 className='text-xl font-semibold tracking-tight mb-4'>{title}</h2>
      )}

      <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
        {authors.map((author) => (
          <HorizontalAuthorCard
            key={author.id}
            author={author}
            bookCount={author.bookCount}
          />
        ))}
      </div>
    </div>
  )
}
