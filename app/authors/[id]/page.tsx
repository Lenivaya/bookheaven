import { getAuthor, getAuthorStats } from '@/app/actions/authors.actions'
import { getBooks } from '@/app/actions/books.actions'
import { bookSearchParamsCache } from '@/app/books/searchParams'
import BookCard from '@/components/books/book-card/BookCard'
import { BookCardSkeleton } from '@/components/books/book-card/BookCardSkeleton'
import { BooksPagination } from '@/components/books/book-pagination/BooksPagination'
import { BooksSearch } from '@/components/books/book-search/BooksSearch'
import { ZoomableImage } from '@/components/generic/ZoomableImage'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BookOpenIcon,
  CalendarIcon,
  HeartIcon,
  ListIcon,
  UsersIcon
} from 'lucide-react'
import { notFound } from 'next/navigation'
import { SearchParams } from 'nuqs/server'
import { Suspense } from 'react'

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

  return (
    <div className='min-h-[800px]'>
      <div className='min-h-[70vh]'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
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

      {books.length === 0 && (
        <div className='absolute inset-0 flex flex-col items-center justify-center'>
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
              Try adjusting your search or filter to find what you&apos;re
              looking for.
            </p>
          </div>
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

// Format date to a readable string
function formatDate(date: Date | null) {
  if (!date) return null
  return new Date(date).getFullYear().toString()
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
    <div className='container mx-auto py-8 mt-20'>
      {/* Author Information Section */}
      <Card className='mb-8 overflow-hidden'>
        <CardContent className='p-8'>
          <div className='flex flex-col md:flex-row gap-8'>
            {/* Author Avatar */}
            <div className='flex flex-col items-center gap-4'>
              <Avatar className='h-48 w-48 border-4 border-background shadow-xl'>
                <ZoomableImage src={author.photoUrl ?? ''} alt={author.name}>
                  <AvatarImage
                    src={author.photoUrl ?? undefined}
                    alt={author.name}
                    className='object-cover'
                  />
                </ZoomableImage>
                <AvatarFallback className='text-4xl'>
                  {author.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Birth/Death Dates */}
              {(author.birthDate || author.deathDate) && (
                <Badge
                  variant='outline'
                  className='flex items-center gap-2 text-sm px-3 py-1'
                >
                  <CalendarIcon className='h-4 w-4' />
                  <span>
                    {formatDate(author.birthDate)}
                    {author.deathDate && ` - ${formatDate(author.deathDate)}`}
                  </span>
                </Badge>
              )}
            </div>

            {/* Author Info */}
            <div className='flex-1 space-y-6'>
              <div>
                <h1 className='text-4xl font-bold tracking-tight mb-4'>
                  {author.name}
                </h1>

                {/* Author Statistics */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                  <Card className='bg-primary/5 border-primary/10'>
                    <CardContent className='p-4 flex items-center gap-3'>
                      <div className='p-2 rounded-lg bg-primary/10'>
                        <BookOpenIcon className='h-5 w-5 text-primary' />
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>
                          Books
                        </p>
                        <p className='text-2xl font-bold'>
                          {authorStats.bookCount}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className='bg-rose-500/5 border-rose-500/10'>
                    <CardContent className='p-4 flex items-center gap-3'>
                      <div className='p-2 rounded-lg bg-rose-500/10'>
                        <HeartIcon className='h-5 w-5 text-rose-500' />
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>
                          Total Likes
                        </p>
                        <p className='text-2xl font-bold'>
                          {authorStats.likesCount || 0}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className='bg-blue-500/5 border-blue-500/10'>
                    <CardContent className='p-4 flex items-center gap-3'>
                      <div className='p-2 rounded-lg bg-blue-500/10'>
                        <UsersIcon className='h-5 w-5 text-blue-500' />
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>
                          Followers
                        </p>
                        <p className='text-2xl font-bold'>
                          {authorStats.followersCount}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className='bg-amber-500/5 border-amber-500/10'>
                    <CardContent className='p-4 flex items-center gap-3'>
                      <div className='p-2 rounded-lg bg-amber-500/10'>
                        <ListIcon className='h-5 w-5 text-amber-500' />
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>
                          In Shelves
                        </p>
                        <p className='text-2xl font-bold'>
                          {authorStats.mentionedInShelvesCount}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {author.biography && (
                <div className='prose prose-md dark:prose-invert max-w-none'>
                  <p className='text-md leading-relaxed text-muted-foreground whitespace-pre-line'>
                    {author.biography}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className='my-8' />

      {/* Books Section */}
      <div>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-3xl font-bold tracking-tight'>
            Books by {author.name}
          </h2>
        </div>

        <div className='flex flex-col justify-between mb-8 w-full'>
          <BooksSearch />
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
          <AuthorBooksList authorId={id} params={searchParamsData} />
        </Suspense>
      </div>
    </div>
  )
}
