import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Author, BookEdition, BookWork, Tag } from '@/db/schema'
import { Link } from 'next-view-transitions'

import { BookCardAuthors } from './BookCardAuthors'
import { ClientBookCover } from './ClientBookCover'
import { ClientPriceAndBuy } from './ClientPriceAndBuy'
import { cn } from '@/lib/utils'

interface HorizontalBookCardProps {
  book: BookWork
  edition: BookEdition
  authors: Author[]
  tags?: Tag[]
  className?: string
  width?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * A horizontal variant of the BookCard component for use in carousels or horizontal scrolling sections
 */
export default function HorizontalBookCard({
  book,
  edition,
  authors,
  className,
  width = 'md'
}: HorizontalBookCardProps) {
  // Define width classes based on the width prop
  const widthClasses = {
    xs: 'w-[200px]',
    sm: 'w-[250px]',
    md: 'w-[300px]',
    lg: 'w-[350px]',
    xl: 'w-[400px]'
  }

  return (
    <Card
      className={cn(
        'group h-full overflow-hidden border-border/40 bg-card/95 transition-all duration-300 hover:border-primary/30 hover:shadow-md dark:bg-card/95 dark:hover:border-primary/40 dark:hover:bg-card/100',
        widthClasses[width],
        className
      )}
    >
      <div className='flex flex-col p-3 h-full'>
        {/* Book cover at the top */}
        <div className='relative h-[160px] w-full mx-auto overflow-hidden rounded-md shadow-sm transition-shadow duration-300 group-hover:shadow-md group mb-3'>
          {/* Client component for interactive book cover */}
          <ClientBookCover
            thumbnailUrl={edition.thumbnailUrl}
            title={book.title}
            editionId={edition.id}
            isOnSale={edition.isOnSale ?? false}
          />
        </div>

        {/* Book details below */}
        <div className='flex flex-col flex-grow'>
          <CardHeader className='space-y-0.5 p-0 pb-2'>
            <Link href={`/books/${edition.id}`}>
              <CardTitle className='line-clamp-1 text-sm font-semibold leading-tight tracking-tight group-hover:text-primary transition-colors duration-200 dark:text-slate-50'>
                {book.title}
              </CardTitle>
            </Link>

            <div className='mt-0.5'>
              <BookCardAuthors authors={authors} />
            </div>
          </CardHeader>

          <CardContent className='flex-grow p-0 py-1'>
            {book.description && (
              <p className='line-clamp-2 text-xs leading-snug text-muted-foreground dark:text-slate-400/90'>
                {book.description}
              </p>
            )}
          </CardContent>

          <CardFooter className='mt-auto flex items-center justify-between p-0 pt-2'>
            <div className='flex items-center gap-1.5'>
              <ClientPriceAndBuy
                price={edition.price}
                salePrice={edition.salePrice}
                isOnSale={edition.isOnSale ?? false}
                bookEdition={edition}
                bookWork={book}
              />
            </div>

            <div className='text-[10px] text-muted-foreground dark:text-slate-500'>
              {edition.format && (
                <span className='font-medium'>{edition.format}</span>
              )}
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  )
}
