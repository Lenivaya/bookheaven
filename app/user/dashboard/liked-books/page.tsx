import { Separator } from '@/components/ui/separator'
import { getUserLikedBooks } from './actions'
import { BooksSearch } from '@/components/books/book-search/BooksSearch'
import { Suspense } from 'react'
import { BookCardSkeleton } from '@/components/books/book-card/BookCardSkeleton'
import BookCard from '@/components/books/book-card/BookCard'
import { getBooks } from '@/app/actions/books.actions'
import { bookSearchParamsCache } from '@/app/books/searchParams'
import { BooksPagination } from '@/components/books/book-pagination/BooksPagination'

const DEFAULT_PAGE_SIZE = 9

async function LikedBooksList({
  params,
  likedBookIds
}: {
  params: Awaited<ReturnType<typeof bookSearchParamsCache.parse>>
  likedBookIds: string[]
}) {
  // If there are no liked books, show a message
  if (likedBookIds.length === 0) {
    return (
      <div className='rounded-lg border bg-card text-card-foreground shadow-sm'>
        <div className='p-6 text-center text-muted-foreground'>
          You haven&apos;t liked any books yet.
        </div>
      </div>
    )
  }

  // Get books with search filters, but only from the liked books
  const { books, totalCount, pageCount } = await getBooks({
    limit: DEFAULT_PAGE_SIZE,
    offset: (Number(params.page) - 1) * DEFAULT_PAGE_SIZE,
    search: params.q,
    tagsIds: params.tags,
    authorsIds: params.authors,
    bookWorksIds: params.books,
    bookEditionsIds: likedBookIds // Only search within liked books
  })

  if (books.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[50vh]'>
        <div className='rounded-lg border border-dashed p-8 text-center max-w-md mx-auto'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='mx-auto h-12 w-12 text-muted-foreground'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
            />
          </svg>
          <h3 className='mt-4 text-lg font-semibold'>No books found</h3>
          <p className='mt-2 text-sm text-muted-foreground'>
            Try adjusting your search or filter to find what you&apos;re looking
            for.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='min-h-[70vh]'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          {books.map((book) => (
            <BookCard
              key={book.edition.id}
              book={book.work}
              edition={book.edition}
              authors={book.authors}
              tags={book.tags}
            />
          ))}
        </div>
      </div>

      {totalCount > DEFAULT_PAGE_SIZE && (
        <div className='mt-8'>
          <BooksPagination
            currentPage={Number(params.page)}
            pageCount={pageCount}
            totalCount={totalCount}
            pageSize={DEFAULT_PAGE_SIZE}
          />
        </div>
      )}
    </>
  )
}

interface LikedBooksPageProps {
  searchParams: Promise<Record<string, string | string[]>>
}

export default async function LikedBooksPage({
  searchParams
}: LikedBooksPageProps) {
  const likedBookIds = await getUserLikedBooks()
  const params = await bookSearchParamsCache.parse(searchParams)

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight'>Liked Books</h2>
        <p className='text-muted-foreground'>
          Books you&apos;ve liked across the platform.
        </p>
      </div>

      <Separator />

      <div className='flex flex-col justify-between mb-5 w-full'>
        <BooksSearch />
      </div>

      <Suspense
        fallback={
          <div className='min-h-[70vh]'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
              {Array.from({ length: 9 }).map((_, index) => (
                <BookCardSkeleton key={index} />
              ))}
            </div>
          </div>
        }
      >
        <LikedBooksList params={params} likedBookIds={likedBookIds} />
      </Suspense>
    </div>
  )
}
