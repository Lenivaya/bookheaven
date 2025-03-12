import { BookCardSkeleton } from '@/components/books/book-card/BookCardSkeleton'
import { BooksPagination } from '@/components/books/book-pagination/BooksPagination'
import { BookShelveCard } from '@/components/bookshelves/bookshelves-card/BookShelveCard'
import { BookShelvesSearch } from '@/components/bookshelves/bookshelves-search/BookShelvesSearch'
import { bookShelvesSearchParamsCache } from '@/components/bookshelves/bookshelves-search/shelves.searchParams'
import { Skeleton } from '@/components/ui/skeleton'
import { SearchParams } from 'nuqs/server'
import { Suspense } from 'react'
import { getBookShelves } from '../actions/bookShelves.actions'
import { bookSearchParamsCache } from '../books/searchParams'

interface BooksPageProps {
  searchParams: Promise<SearchParams>
}

const DEFAULT_PAGE_SIZE = 9

// Separate component for the book list to allow for Suspense
async function BooksShelvesList({
  params
}: {
  params: Awaited<ReturnType<typeof bookShelvesSearchParamsCache.parse>>
}) {
  const { shelves, totalCount, pageCount } = await getBookShelves({
    limit: DEFAULT_PAGE_SIZE,
    offset: (Number(params.page) - 1) * DEFAULT_PAGE_SIZE,
    search: params.q,
    tagsIds: params.tags,
    authorsIds: params.authors,
    bookWorksIds: params.books,
    onlyPublic: true
  })

  if (shelves.length === 0) {
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
          <h3 className='mt-4 text-lg font-semibold'>No book shelves found</h3>
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
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {shelves.map((shelf) => (
            <BookShelveCard key={shelf.id} shelf={shelf} />
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

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const params = await bookSearchParamsCache.parse(searchParams)

  return (
    <div className='container mx-auto py-8 mt-20'>
      <div className='flex flex-col justify-between mb-5 w-full'>
        <BookShelvesSearch />
      </div>

      <Suspense
        fallback={
          <div className='min-h-[70vh]'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
              {Array.from({ length: 9 }).map((_, index) => (
                <BookCardSkeleton key={index} />
              ))}
            </div>
            <PaginationSkeleton />
          </div>
        }
      >
        <BooksShelvesList params={params} />
      </Suspense>
    </div>
  )
}
