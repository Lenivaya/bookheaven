import { getBooks } from '@/app/actions/books.actions'
import { bookSearchParamsCache } from '@/app/books/searchParams'
import { BooksSearch } from '@/components/books/book-search/BooksSearch'
import { BooksPagination } from '@/components/books/book-pagination/BooksPagination'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SearchParams } from 'nuqs/server'
import BookCard from '@/components/books/book-card/BookCard'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { Link } from 'next-view-transitions'

const DEFAULT_PAGE_SIZE = 6

interface AdminBooksPageProps {
  searchParams: Promise<SearchParams>
}

export default async function AdminBooksPage({
  searchParams
}: AdminBooksPageProps) {
  const params = await bookSearchParamsCache.parse(searchParams)

  const { books, totalCount, pageCount } = await getBooks({
    limit: DEFAULT_PAGE_SIZE,
    offset: (Number(params.page) - 1) * DEFAULT_PAGE_SIZE,
    search: params.q,
    tagsIds: params.tags,
    authorsIds: params.authors,
    bookWorksIds: params.books
  })

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-semibold tracking-tight'>Books</h2>
          <p className='text-muted-foreground'>
            Manage books catalog and inventory.
          </p>
        </div>

        <Button size='sm' className='gap-1' asChild>
          <Link href='/forms/books'>
            <PlusIcon className='h-4 w-4' />
            <span>Add Book</span>
          </Link>
        </Button>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Books Management</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <BooksSearch />

          <div className='min-h-[70vh]'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {books.map((book) => (
                <BookCard
                  key={book.edition.id}
                  book={book.work}
                  edition={book.edition}
                  authors={book.authors}
                  tags={book.tags}
                  showAdminActions={true}
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

          {books.length === 0 && (
            <div className='rounded-lg border bg-card text-card-foreground shadow-sm'>
              <div className='p-6 text-center text-muted-foreground'>
                No books found.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
