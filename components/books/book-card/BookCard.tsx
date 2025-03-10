import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Author, BookEdition, BookWork, Tag } from '@/db/schema'
import { Protect } from '@clerk/nextjs'
import Link from 'next/link'
import { BookActions } from './BookActions'
import { BookCardAuthors } from './BookCardAuthors'
import { BookCardBuyButton } from './BookCardBuyButton'
import { BookCoverImage } from './BookCoverImage'
import { BookPriceDisplay } from './BookPriceDisplay'
import { BookTagsList } from './BookTagsList'

interface BookCardProps {
  book: BookWork
  edition: BookEdition
  authors: Author[]
  tags: Tag[]
}

export default function BookCard({
  book,
  edition,
  authors,
  tags
}: BookCardProps) {
  return (
    <Card className='group h-full overflow-hidden border-border/40 bg-card/95 transition-all duration-300 hover:border-primary/30 hover:shadow-md dark:bg-card/95 dark:hover:border-primary/40 dark:hover:bg-card/100'>
      <div className='grid grid-cols-[120px_1fr] gap-3 p-3'>
        {/* Book cover on the left */}
        <div className='relative h-[180px] w-[120px] overflow-hidden rounded-md shadow-sm transition-shadow duration-300 group-hover:shadow-md group'>
          <Link
            href={`/books/${book.id}`}
            className='block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          >
            <BookCoverImage
              thumbnailUrl={edition.thumbnailUrl}
              title={book.title}
              bookEditionId={edition.id}
            />
          </Link>

          {/* Book Actions Component */}
          <Protect>
            <BookActions
              bookId={book.id}
              bookTitle={book.title}
              editionId={edition.id}
            />
          </Protect>

          {edition.isOnSale && (
            <div className='absolute right-0 top-0 z-10'>
              <Badge
                variant='destructive'
                className='rounded-none rounded-bl-sm px-1.5 py-0.5 text-[10px] font-medium'
              >
                Sale
              </Badge>
            </div>
          )}
        </div>

        {/* Book details on the right */}
        <div className='flex flex-col'>
          <CardHeader className='space-y-1 p-0 pb-1'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/books/${edition.id}`}>
                    <CardTitle className='line-clamp-2 text-base font-semibold leading-tight tracking-tight group-hover:text-primary transition-colors duration-200 dark:text-slate-50'>
                      {book.title}
                    </CardTitle>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side='top'
                  align='start'
                  className='max-w-[250px]'
                >
                  <p>{book.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <HoverCard>
              <HoverCardTrigger asChild>
                <div className='mt-0.5'>
                  <BookCardAuthors authors={authors} />
                </div>
              </HoverCardTrigger>
              <HoverCardContent className='w-80' side='right'>
                {authors.map((author) => (
                  <div key={author.id} className='flex flex-col space-y-1'>
                    <h4 className='text-sm font-semibold'>{author.name}</h4>
                    {author.biography && (
                      <p className='text-xs text-muted-foreground line-clamp-4'>
                        {author.biography}
                      </p>
                    )}
                  </div>
                ))}
              </HoverCardContent>
            </HoverCard>
          </CardHeader>

          <CardContent className='flex-grow p-0 py-1'>
            {book.description && (
              <p className='line-clamp-3 text-sm leading-snug text-muted-foreground dark:text-slate-400/90'>
                {book.description}
              </p>
            )}
          </CardContent>

          <CardFooter className='mt-auto flex flex-col items-start gap-1.5 p-0 pt-1'>
            {/* Tag section with min-height instead of fixed height */}
            <div className='min-h-[32px] w-full'>
              <BookTagsList tags={tags} />
            </div>

            <div className='flex w-full items-center justify-between mt-1'>
              <div className='flex items-center gap-2.5'>
                <BookPriceDisplay
                  price={edition.price}
                  salePrice={edition.salePrice}
                  isOnSale={edition.isOnSale ?? false}
                />

                <BookCardBuyButton />
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
