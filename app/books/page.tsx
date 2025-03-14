import { Suspense } from 'react'
import { getBooks } from '@/app/actions/books.actions'
import BookCard from '@/components/books/book-card/BookCard'
import { BooksSearch } from '@/components/books/book-search/BooksSearch'
import { SearchParams } from 'nuqs/server'
import { bookSearchParamsCache } from './searchParams'
import { BooksPagination } from '@/components/books/book-pagination/BooksPagination'
import { BookCardSkeleton } from '@/components/books/book-card/BookCardSkeleton'
import { Skeleton } from '@/components/ui/skeleton'

interface BooksPageProps {
  searchParams: Promise<SearchParams>
}

const DEFAULT_PAGE_SIZE = 9

// Empty state component
function EmptyState() {
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

// Separate component for the book grid to allow for more granular suspense
function BookGrid({ books }: { books: any[] }) {
  return (
    <div className='grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
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
  )
}

// Separate component for the book list to allow for Suspense
async function BooksList({
  params
}: {
  params: Awaited<ReturnType<typeof bookSearchParamsCache.parse>>
}) {
  const { books, totalCount, pageCount } = await getBooks({
    limit: DEFAULT_PAGE_SIZE,
    offset: (Number(params.page) - 1) * DEFAULT_PAGE_SIZE,
    search: params.q,
    tagsIds: params.tags,
    authorsIds: params.authors,
    bookWorksIds: params.books
  })

  if (books.length === 0) {
    return <EmptyState />
  }

  // console.log(totalCount)

  return (
    <>
      <div className='min-h-[70vh]'>
        <BookGrid books={books} />
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

// Skeleton component for pagination
function PaginationSkeleton() {
  return (
    <div className='mt-8 flex justify-center'>
      <div className='flex items-center gap-2'>
        <Skeleton className='h-9 w-9 rounded-md' />
        <Skeleton className='h-9 w-9 rounded-md' />
        <Skeleton className='h-9 w-9 rounded-md' />
        <Skeleton className='h-9 w-9 rounded-md' />
        <Skeleton className='h-9 w-9 rounded-md' />
      </div>
    </div>
  )
}

// Skeleton component for the book grid
function BookGridSkeleton() {
  return (
    <div className='grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
      {Array.from({ length: 9 }).map((_, index) => (
        <BookCardSkeleton key={index} />
      ))}
    </div>
  )
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  // Parse search params outside of suspense to avoid waterfall
  const params = await bookSearchParamsCache.parse(searchParams)

  return (
    <div className='container mx-auto py-8 mt-20'>
      {/* Search component loads immediately */}
      <div className='flex flex-col justify-between mb-5 w-full'>
        <BooksSearch />
      </div>

      {/* Progressive loading with suspense */}
      <Suspense
        fallback={
          <div className='min-h-[70vh]'>
            <BookGridSkeleton />
            <PaginationSkeleton />
          </div>
        }
      >
        <BooksList params={params} />
      </Suspense>
    </div>
  )
}
