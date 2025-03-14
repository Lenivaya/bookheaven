import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Author } from '@/db/schema'
import { cn } from '@/lib/utils'
import { BookOpenIcon } from 'lucide-react'
import { Link } from 'next-view-transitions'

interface CompactAuthorCardProps {
  author: Author
  bookCount?: number
  className?: string
}

/**
 * A compact author card component for use in sidebars or other places where space is limited
 */
export function CompactAuthorCard({
  author,
  bookCount,
  className
}: CompactAuthorCardProps) {
  return (
    <Card
      className={cn(
        'overflow-hidden hover:bg-accent/50 transition-colors duration-200',
        className
      )}
    >
      <Link href={`/authors/${author.id}`} className='block'>
        <CardContent className='p-3 flex items-center gap-3'>
          <Avatar className='h-12 w-12 border-2 border-background shadow-sm'>
            <AvatarImage
              src={author.photoUrl ?? undefined}
              alt={author.name}
              className='object-cover'
            />
            <AvatarFallback className='text-sm'>
              {author.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className='flex-1 min-w-0'>
            <h3 className='font-medium text-sm leading-tight truncate'>
              {author.name}
            </h3>

            {author.biography && (
              <p className='text-xs text-muted-foreground line-clamp-1 mt-0.5'>
                {author.biography}
              </p>
            )}

            {bookCount !== undefined && (
              <div className='flex items-center gap-1 mt-1 text-xs text-muted-foreground'>
                <BookOpenIcon className='h-3 w-3' />
                <span>
                  {bookCount} {bookCount === 1 ? 'book' : 'books'}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

/**
 * A horizontal layout for the compact author card
 */
export function HorizontalAuthorCard({
  author,
  bookCount,
  className
}: CompactAuthorCardProps) {
  return (
    <Card
      className={cn(
        'overflow-hidden hover:bg-accent/50 transition-colors duration-200 w-[220px] sm:w-[250px]',
        className
      )}
    >
      <Link href={`/authors/${author.id}`} className='block h-full'>
        <CardContent className='p-4 flex flex-col items-center text-center h-full'>
          <Avatar className='h-16 w-16 mb-3 border-2 border-background shadow-sm'>
            <AvatarImage
              src={author.photoUrl ?? undefined}
              alt={author.name}
              className='object-cover'
            />
            <AvatarFallback className='text-lg'>
              {author.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className='flex-1 min-w-0 w-full'>
            <h3 className='font-medium text-sm leading-tight truncate'>
              {author.name}
            </h3>

            {author.biography && (
              <p className='text-xs text-muted-foreground line-clamp-2 mt-1'>
                {author.biography}
              </p>
            )}

            {bookCount !== undefined && (
              <div className='flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground'>
                <BookOpenIcon className='h-3 w-3' />
                <span>
                  {bookCount} {bookCount === 1 ? 'book' : 'books'}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
