import { getAuthor, getAuthorStats } from '@/app/actions/authors.actions'
import { getBooks } from '@/app/actions/books.actions'
import { bookSearchParamsCache } from '@/app/books/searchParams'
import {
  AuthorPageBookCard,
  AuthorPageBookGrid,
  AuthorPageBookCardSkeleton,
  EmptyBookState,
  EmptyBookStateSkeleton,
  BooksSearch,
  BooksPagination
} from '@/components/books'
import { AuthorProfile } from '@/components/authors'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'
import { SearchParams } from 'nuqs/server'
import { Suspense } from 'react'
import { Link } from 'next-view-transitions'

interface AuthorPageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<SearchParams>
}

const DEFAULT_BOOKS_PAGE_SIZE = 9

// Separate component for the book list to allow for Suspense
async function AuthorBooksList({
  authorId,
  params
}: {
  authorId: string
  params: Awaited<ReturnType<typeof bookSearchParamsCache.parse>>
}) {
  const { books, totalCount, pageCount } = await getBooks({
    authorsIds: [authorId],
    limit: DEFAULT_BOOKS_PAGE_SIZE,
    offset: (Number(params.page) - 1) * DEFAULT_BOOKS_PAGE_SIZE,
    tagsIds: params.tags,
    search: params.q
  })

  const hasFilters = params.q || params.tags?.length > 0

  if (books.length === 0) {
    return (
      <EmptyBookState
        title='No books found for this author'
        message={
          params.q
            ? `No books match your search "${params.q}". Try adjusting your search or filter.`
            : "We couldn't find any books for this author with the current filters. Try adjusting your filters."
        }
      >
        {hasFilters && (
          <Link href={`/authors/${authorId}`}>
            <Button variant='outline' className='mt-2'>
              Clear all filters
            </Button>
          </Link>
        )}
      </EmptyBookState>
    )
  }

  return (
    <div className='min-h-[800px]'>
      <div className='min-h-[70vh]'>
        {/* Use the specialized AuthorPageBookGrid component */}
        <AuthorPageBookGrid>
          {books.map((book) => (
            <AuthorPageBookCard
              key={book.edition.id}
              book={book.work}
              edition={book.edition}
              authors={book.authors}
              tags={book.tags}
            />
          ))}
        </AuthorPageBookGrid>
      </div>

      {totalCount > DEFAULT_BOOKS_PAGE_SIZE && (
        <div className='mt-8'>
          <BooksPagination
            currentPage={Number(params.page)}
            pageCount={pageCount}
            totalCount={totalCount}
            pageSize={DEFAULT_BOOKS_PAGE_SIZE}
          />
        </div>
      )}
    </div>
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

export default async function AuthorPage({
  params,
  searchParams
}: AuthorPageProps) {
  const { id } = await params
  const [author, authorStats] = await Promise.all([
    getAuthor(id),
    getAuthorStats(id)
  ])

  if (!author) {
    return notFound()
  }

  const searchParamsData = await bookSearchParamsCache.parse(searchParams)

  return (
    <div className='container mx-auto px-4 py-6 sm:py-8 mt-16 sm:mt-20'>
      {/* Use the AuthorProfile component */}
      <AuthorProfile author={author} stats={authorStats} />

      <Separator className='my-6 sm:my-8' />

      {/* Books Section */}
      <div>
        <div className='flex items-center justify-between mb-4 sm:mb-6'>
          <h2 className='text-xl sm:text-2xl md:text-3xl font-bold tracking-tight'>
            Books by {author.name}
          </h2>
        </div>

        <div className='flex flex-col justify-between mb-6 sm:mb-8 w-full'>
          <BooksSearch />
        </div>

        <Suspense
          fallback={
            <div className='min-h-[70vh]'>
              {/* Show either book skeletons or empty state skeleton based on a random condition */}
              {Math.random() > 0.2 ? (
                <AuthorPageBookGrid>
                  {Array.from({ length: 9 }).map((_, index) => (
                    <AuthorPageBookCardSkeleton key={index} />
                  ))}
                </AuthorPageBookGrid>
              ) : (
                <EmptyBookStateSkeleton />
              )}
              <PaginationSkeleton />
            </div>
          }
        >
          <AuthorBooksList authorId={id} params={searchParamsData} />
        </Suspense>
      </div>
    </div>
  )
}
