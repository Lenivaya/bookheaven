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

interface CompactBookCardProps {
  book: BookWork
  edition: BookEdition
  authors: Author[]
  tags?: Tag[]
}

/**
 * A compact version of the BookCard component for use in sidebars or when space is limited
 */
export default function CompactBookCard({
  book,
  edition,
  authors
}: CompactBookCardProps) {
  return (
    <Card className='group h-full overflow-hidden border-border/40 bg-card/95 transition-all duration-300 hover:border-primary/30 hover:shadow-md dark:bg-card/95 dark:hover:border-primary/40 dark:hover:bg-card/100'>
      <div className='grid grid-cols-[80px_1fr] xs:grid-cols-[90px_1fr] sm:grid-cols-[100px_1fr] gap-2 p-2'>
        {/* Book cover on the left */}
        <div className='relative h-[120px] xs:h-[135px] sm:h-[150px] w-full overflow-hidden rounded-md shadow-sm transition-shadow duration-300 group-hover:shadow-md group'>
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
          <CardHeader className='space-y-0.5 p-0 pb-1'>
            <Link href={`/books/${edition.id}`}>
              <CardTitle className='line-clamp-2 text-xs xs:text-sm font-semibold leading-tight tracking-tight group-hover:text-primary transition-colors duration-200 dark:text-slate-50'>
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

          <CardFooter className='mt-auto flex items-center justify-between p-0 pt-1'>
            <div className='flex items-center gap-1 xs:gap-1.5'>
              <ClientPriceAndBuy
                price={edition.price}
                salePrice={edition.salePrice}
                isOnSale={edition.isOnSale ?? false}
                bookEdition={edition}
                bookWork={book}
              />
            </div>

            <div className='text-[9px] xs:text-[10px] text-muted-foreground dark:text-slate-500'>
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
