import { Author, BookEdition, BookWork, Tag } from '@/db/schema'
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
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { BookCoverImage } from './BookCoverImage'
import { BookTagsList } from './BookTagsList'
import { BookPriceDisplay } from './BookPriceDisplay'

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
    <Link
      href={`/books/${book.id}`}
      className='block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
    >
      <Card className='group h-full overflow-hidden border-border/40 bg-background transition-all hover:border-primary/20 hover:shadow-sm dark:bg-card/95 dark:hover:border-primary/30 dark:hover:bg-card/100'>
        <div className='grid grid-cols-[100px_1fr] gap-3 p-3'>
          <div className='relative h-[150px] w-[100px] overflow-hidden rounded-sm'>
            <BookCoverImage
              thumbnailUrl={edition.thumbnailUrl}
              title={book.title}
            />

            {edition.isOnSale && (
              <div className='absolute right-0 top-0 z-10'>
                <Badge
                  variant='destructive'
                  className='rounded-none rounded-bl-sm px-1 py-0 text-[9px]'
                >
                  Sale
                </Badge>
              </div>
            )}
          </div>

          <div className='flex flex-col'>
            <CardHeader className='space-y-0 p-0 pb-1'>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CardTitle className='line-clamp-1 text-sm font-medium group-hover:text-primary transition-colors dark:text-slate-50'>
                      {book.title}
                    </CardTitle>
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
                  <p className='line-clamp-1 text-xs text-muted-foreground dark:text-slate-400'>
                    {authors.map((author) => author.name).join(', ')}
                  </p>
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
                <p className='line-clamp-2 text-xs text-muted-foreground dark:text-slate-400/90'>
                  {book.description}
                </p>
              )}
            </CardContent>

            <CardFooter className='mt-auto flex flex-col items-start gap-1.5 p-0 pt-1'>
              <BookTagsList tags={tags} />

              <Separator className='my-1.5 w-full dark:bg-slate-800' />

              <div className='flex w-full items-center justify-between'>
                <BookPriceDisplay
                  price={edition.price}
                  salePrice={edition.salePrice}
                  isOnSale={edition.isOnSale ?? false}
                />

                <div className='text-[10px] text-muted-foreground dark:text-slate-500'>
                  {edition.format && <span>{edition.format}</span>}
                  {edition.pageCount && <span> · {edition.pageCount} pg</span>}
                </div>
              </div>
            </CardFooter>
          </div>
        </div>
      </Card>
    </Link>
  )
}
