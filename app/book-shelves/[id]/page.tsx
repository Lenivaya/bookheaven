import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Link } from 'next-view-transitions'

import { Suspense } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { BookOpenIcon } from 'lucide-react'
import { getShelfByIdWithBooks } from '@/app/actions/bookShelves.actions'
import { BookShelveUserInfo } from '@/components/bookshelves/bookshelves-card/BookShelveUserInfo'
import { ShelfEditButton } from '@/components/bookshelves/bookshelves-card/ShelfEditButton'
import { ShelfLikeButton } from '@/components/bookshelves/bookshelves-card/ShelfLikeButton'

interface BookShelvePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function BookShelvePage({ params }: BookShelvePageProps) {
  // Always await params in Next.js App Router
  const { id } = await params

  // Fetch the shelf with books
  const shelf = await getShelfByIdWithBooks(id)

  if (!shelf) {
    return notFound()
  }

  return (
    <div className='container py-8 max-w-6xl mx-auto'>
      {/* Header section with shelf info */}
      <div className='mb-8 space-y-6 mt-25'>
        <div className='flex justify-between items-start gap-4 flex-wrap'>
          <div className='space-y-2 flex-1 min-w-[280px]'>
            <h1 className='text-3xl font-bold tracking-tight'>{shelf.name}</h1>
            {shelf.description && (
              <p className='text-muted-foreground'>{shelf.description}</p>
            )}
            <div className='flex flex-wrap items-center gap-2 mt-3'>
              <Badge variant='outline' className='flex items-center gap-1'>
                <BookOpenIcon className='h-3 w-3' />
                <span>{shelf.items.length} books</span>
              </Badge>
              {!shelf.isPublic && <Badge variant='secondary'>Private</Badge>}
            </div>
          </div>

          <div className='flex gap-2'>
            <ShelfEditButton shelfId={shelf.id} shelfUserId={shelf.userId} />
            <ShelfLikeButton shelfId={shelf.id} likesCount={shelf.likesCount} />
          </div>
        </div>

        <Suspense
          fallback={<div className='h-8 animate-pulse bg-muted rounded' />}
        >
          <BookShelveUserInfo
            userId={shelf.userId}
            createdAt={shelf.created_at}
          />
        </Suspense>

        <Separator />
      </div>

      {/* Books grid section */}
      <div className='space-y-6'>
        <h2 className='text-xl font-semibold'>Books in this shelf</h2>

        {shelf.items.length > 0 ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'>
            {shelf.items.map((item) => (
              <Link
                href={`/books/${item.editionId}`}
                key={`${item.shelfId}-${item.editionId}`}
                className='group'
              >
                <div className='flex flex-col h-full'>
                  <div className='relative aspect-[2/3] w-full overflow-hidden rounded-md shadow-sm mb-3 bg-muted/50'>
                    {item.bookEdition.thumbnailUrl ? (
                      <Image
                        src={item.bookEdition.thumbnailUrl}
                        alt={item.bookEdition.work.title || 'Book cover'}
                        fill
                        sizes='(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw'
                        className='object-cover transition-transform group-hover:scale-105'
                      />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center'>
                        <BookOpenIcon className='h-12 w-12 text-muted-foreground' />
                      </div>
                    )}
                  </div>

                  <div className='flex-1 space-y-1'>
                    <h3 className='font-medium line-clamp-2 group-hover:text-primary transition-colors'>
                      {item.bookEdition.work.title}
                    </h3>
                    <p className='text-sm text-muted-foreground line-clamp-1'>
                      {item.bookEdition.work.workToAuthors?.length > 0
                        ? item.bookEdition.work.workToAuthors
                            .map((wa) => wa.author.name)
                            .join(', ')
                        : 'Unknown author'}
                    </p>
                    {item.bookEdition.publisher && (
                      <p className='text-xs text-muted-foreground'>
                        {item.bookEdition.publisher}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center'>
            <BookOpenIcon className='h-12 w-12 text-muted-foreground mb-4' />
            <h3 className='text-lg font-medium mb-1'>No books yet</h3>
            <p className='text-muted-foreground mb-4'>
              This shelf doesn&apos;t have any books added to it.
            </p>
            <Button asChild variant='outline'>
              <Link href='/books'>Browse books</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
