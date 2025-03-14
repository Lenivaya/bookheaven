import { FetchedShelfRelations } from '@/app/actions/bookShelves.actions'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { BookOpenIcon, ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import { Link } from 'next-view-transitions'

import { Suspense } from 'react'
import { BookShelveUserInfo } from './BookShelveUserInfo'
import { ShelfDeleteButton } from './ShelfDeleteButton'
import { ShelfEditButton } from './ShelfEditButton'
import { ShelfLikeButton } from './ShelfLikeButton'

interface BookShelveCardProps {
  shelf: FetchedShelfRelations
}

export function BookShelveCard({ shelf }: BookShelveCardProps) {
  // Get the first 5 books to display in the gallery
  const displayBooks = shelf.items.slice(0, 5)
  const totalBooks = shelf.items.length
  const hasMoreBooks = totalBooks > 5

  return (
    <Card className='overflow-hidden transition-all hover:shadow-md'>
      <CardHeader className='pb-3'>
        {/* User information section */}
        <div className='mb-3 flex justify-between items-start'>
          <Suspense
            fallback={<div className='h-8 animate-pulse bg-muted rounded' />}
          >
            <BookShelveUserInfo
              userId={shelf.userId}
              createdAt={shelf.created_at}
            />
          </Suspense>
          <div className='flex gap-1'>
            <ShelfEditButton shelfId={shelf.id} shelfUserId={shelf.userId} />
            <ShelfDeleteButton shelfId={shelf.id} shelfUserId={shelf.userId} />
          </div>
        </div>

        <div className='flex justify-between items-start'>
          <div>
            <CardTitle className='text-xl font-bold'>{shelf.name}</CardTitle>
            <CardDescription className='line-clamp-2 mt-1'>
              {shelf.description || 'No description provided'}
            </CardDescription>
          </div>
          <Badge variant='outline' className='flex items-center gap-1'>
            <BookOpenIcon className='h-3 w-3' />
            <span>{totalBooks}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className='pb-2'>
        {displayBooks.length > 0 ? (
          <div className='relative overflow-hidden'>
            <div className='flex gap-2 overflow-x-auto pb-2 scrollbar-hide'>
              {displayBooks.map((item) => (
                <div
                  key={`${item.shelfId}-${item.editionId}`}
                  className='relative flex-shrink-0 group'
                >
                  <Link href={`/books/${item.editionId}`}>
                    <div className='relative h-[140px] w-[90px] overflow-hidden rounded-md shadow-sm'>
                      {item.bookEdition.thumbnailUrl ? (
                        <Image
                          src={item.bookEdition.thumbnailUrl}
                          alt={item.bookEdition.work.title || 'Book cover'}
                          fill
                          sizes='90px'
                          className='object-cover transition-transform group-hover:scale-105'
                        />
                      ) : (
                        <div className='flex h-full w-full items-center justify-center bg-muted'>
                          <BookOpenIcon className='h-8 w-8 text-muted-foreground' />
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className='mt-1 w-[90px] text-xs'>
                    <p className='font-medium line-clamp-1'>
                      {item.bookEdition.work.title}
                    </p>
                    <p className='text-muted-foreground line-clamp-1'>
                      {item.bookEdition.work.workToAuthors
                        .map((author) => author.author.name)
                        .join(', ') || 'Unknown author'}
                    </p>
                  </div>
                </div>
              ))}
              {hasMoreBooks && (
                <div className='flex-shrink-0 flex items-center justify-center h-[140px] w-[50px] rounded-md bg-muted/50'>
                  <div className='text-xs text-muted-foreground text-center'>
                    +{totalBooks - 5} more
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className='flex h-[140px] items-center justify-center rounded-md border border-dashed'>
            <p className='text-sm text-muted-foreground'>
              No books in this shelf
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className='pt-2 flex justify-between items-center'>
        <Link
          href={`book-shelves/${shelf.id}`}
          className={cn(
            'flex items-center text-sm font-medium',
            'text-primary hover:underline'
          )}
        >
          <span>View shelf</span>
          <ChevronRightIcon className='h-4 w-4 ml-1' />
        </Link>

        <Suspense
          fallback={<div className='h-8 w-16 animate-pulse bg-muted rounded' />}
        >
          <ShelfLikeButton shelfId={shelf.id} likesCount={shelf.likesCount} />
        </Suspense>
      </CardFooter>
    </Card>
  )
}
