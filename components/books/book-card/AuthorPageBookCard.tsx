import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Author, BookEdition, BookWork, Tag } from '@/db/schema'
import { Link } from 'next-view-transitions'

import { BookCardAuthors } from './BookCardAuthors'
import { BookTagsList } from './BookTagsList'
import { ClientBookCover } from './ClientBookCover'
import { ClientPriceAndBuy } from './ClientPriceAndBuy'
import { cn } from '@/lib/utils'

interface AuthorPageBookCardProps {
  book: BookWork
  edition: BookEdition
  authors: Author[]
  tags: Tag[]
  className?: string
}

/**
 * A specialized BookCard variant optimized for the author page layout
 * - Takes full width
 * - Larger cover image
 * - More space for description
 */
export function AuthorPageBookCard({
  book,
  edition,
  authors,
  tags,
  className
}: AuthorPageBookCardProps) {
  return (
    <Card
      className={cn(
        'group h-full overflow-hidden border-border/40 bg-card/95 transition-all duration-300 hover:border-primary/30 hover:shadow-md dark:bg-card/95 dark:hover:border-primary/40 dark:hover:bg-card/100',
        className
      )}
    >
      <div className='grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 p-4'>
        {/* Book cover on the left - larger for author page */}
        <div className='relative h-[180px] sm:h-[210px] md:h-[240px] w-full overflow-hidden rounded-md shadow-sm transition-shadow duration-300 group-hover:shadow-md group'>
          {/* Client component for interactive book cover */}
          <ClientBookCover
            thumbnailUrl={edition.thumbnailUrl}
            title={book.title}
            editionId={edition.id}
            isOnSale={edition.isOnSale ?? false}
          />
        </div>

        {/* Book details on the right */}
        <div className='flex flex-col'>
          <CardHeader className='space-y-1 p-0 pb-2'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/books/${edition.id}`}>
                    <CardTitle className='line-clamp-2 text-sm sm:text-lg md:text-xl font-semibold leading-tight tracking-tight group-hover:text-primary transition-colors duration-200 dark:text-slate-50'>
                      {book.title}
                    </CardTitle>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side='top'
                  align='start'
                  className='max-w-[250px] sm:max-w-[300px]'
                >
                  <p>{book.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Hide authors on author page since we're already on the author's page */}
            {authors.length > 1 && (
              <div className='mt-1'>
                <BookCardAuthors authors={authors} />
              </div>
            )}
          </CardHeader>

          <CardContent className='flex-grow p-0 py-2'>
            {book.description && (
              <p className='line-clamp-3 sm:line-clamp-4 md:line-clamp-5 text-xs sm:text-sm leading-snug text-muted-foreground dark:text-slate-400/90'>
                {book.description}
              </p>
            )}
          </CardContent>

          <CardFooter className='mt-auto flex flex-col items-start gap-2 p-0 pt-2'>
            {/* Tag section */}
            <div className='min-h-[24px] sm:min-h-[32px] w-full'>
              <BookTagsList tags={tags} />
            </div>

            <div className='flex w-full items-center justify-between mt-1'>
              <div className='flex items-center gap-2 sm:gap-3'>
                <ClientPriceAndBuy
                  price={edition.price}
                  salePrice={edition.salePrice}
                  isOnSale={edition.isOnSale ?? false}
                  bookEdition={edition}
                  bookWork={book}
                />
              </div>

              <div className='text-xs text-muted-foreground dark:text-slate-500'>
                {edition.format && (
                  <span className='font-medium'>{edition.format}</span>
                )}
                {edition.pageCount && <span> · {edition.pageCount} pg</span>}
              </div>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  )
}
