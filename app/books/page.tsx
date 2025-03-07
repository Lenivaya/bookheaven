import { getBooks } from '@/app/actions/books.actions'
import BookCard from '@/components/books/book-card/BookCard'
import { BooksSearch } from '@/components/books/book-search/BooksSearch'
import { SearchParams } from 'nuqs/server'
import { bookSearchParamsCache } from './searchParams'

interface BooksPageProps {
  searchParams: Promise<SearchParams>
}

const DEFAULT_PAGE_SIZE = 11

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const params = await bookSearchParamsCache.parse(searchParams)
  const books = await getBooks({
    limit: DEFAULT_PAGE_SIZE,
    offset: (Number(params.page) - 1) * DEFAULT_PAGE_SIZE,
    search: params.q,
    tagsIds: params.tags,
    authorsIds: params.authors,
    bookWorksIds: params.books
  })

  return (
    <div className='container mx-auto py-8'>
      <div className='flex flex-col justify-between mb-5 w-full'>
        <BooksSearch />
      </div>

      {books.length === 0 ? (
        <div className='flex flex-col items-center justify-center min-h-[50vh]'>
          <div className='rounded-lg border border-dashed p-8 text-center max-w-md mx-auto'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-12 w-12 mx-auto mb-4 text-muted-foreground/60'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
              />
            </svg>
            <h3 className='text-lg font-semibold mb-2'>No books found</h3>
            <p className='text-muted-foreground text-sm'>
              Try adjusting your search or filter criteria to find what
              you&apos;re looking for.
            </p>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {books.map((book) => (
            <BookCard
              key={book.work.id}
              book={book.work}
              edition={book.edition}
              authors={book.authors}
              tags={book.tags}
            />
          ))}
        </div>
      )}
    </div>
  )
}
