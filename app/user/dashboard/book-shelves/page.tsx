import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PlusIcon } from 'lucide-react'
import { auth } from '@clerk/nextjs/server'
import { getBookShelves } from '@/app/actions/bookShelves.actions'
import { notFound } from 'next/navigation'
import { isNone } from '@/lib/types'
import { BookShelvesPagination } from '@/components/bookshelves/BookShelvesPagination'
import { SearchParams } from 'nuqs/server'
import { bookShelvesSearchParamsCache } from '@/components/bookshelves/bookshelves-search/shelves.searchParams'
import { BookShelveCard } from '@/components/bookshelves/bookshelves-card/BookShelveCard'
import { BookShelvesSearch } from '@/components/bookshelves/bookshelves-search/BookShelvesSearch'
import { Link } from 'next-view-transitions'

const DEFAULT_PAGE_SIZE = 10

interface BookShelvesPageProps {
  searchParams: Promise<SearchParams>
}

export default async function BookShelvesPage({
  searchParams
}: BookShelvesPageProps) {
  const params = await bookShelvesSearchParamsCache.parse(searchParams)

  const userId = (await auth()).userId
  if (isNone(userId)) {
    return notFound()
  }

  const { shelves, totalCount, pageCount } = await getBookShelves({
    userIds: [userId],
    limit: DEFAULT_PAGE_SIZE,
    offset: (Number(params.page) - 1) * DEFAULT_PAGE_SIZE,
    search: params.q
  })

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-semibold tracking-tight'>
            Book Shelves
          </h2>
          <p className='text-muted-foreground'>
            Create and manage your custom book collections.
          </p>
        </div>

        <Button size='sm' className='gap-1' asChild>
          <Link href='/forms/book-shelves'>
            <PlusIcon className='h-4 w-4' />
            <span>New Shelf</span>
          </Link>
        </Button>
      </div>

      <Separator />

      <BookShelvesSearch />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {shelves.map((shelf) => (
          <BookShelveCard key={shelf.id} shelf={shelf} />
        ))}
      </div>
      {totalCount > DEFAULT_PAGE_SIZE && (
        <div className='mt-8'>
          <BookShelvesPagination
            currentPage={Number(params.page)}
            pageCount={pageCount}
            totalCount={totalCount}
            pageSize={DEFAULT_PAGE_SIZE}
          />
        </div>
      )}

      {shelves.length <= 0 && (
        <div className='rounded-lg border bg-card text-card-foreground shadow-sm'>
          <div className='p-6 text-center text-muted-foreground'>
            You haven&apos;t created any book shelves yet.
          </div>
        </div>
      )}
    </div>
  )
}
