import { getAuthors } from '@/app/actions/authors.actions'
import AuthorList from '@/components/authors/author-list/AuthorList'
import { AuthorsSearch } from '@/components/authors/author-search/AuthorsSearch'
import { SearchParams } from 'nuqs/server'
import { authorSearchParamsCache } from './searchParams'
import { AuthorPagination } from '@/components/authors/author-pagination/AuthorPagination'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { Link } from 'next-view-transitions'

import { Separator } from '@/components/ui/separator'
import { checkRole } from '@/lib/auth/utils'

interface AuthorsPageProps {
  searchParams: Promise<SearchParams>
}

const DEFAULT_PAGE_SIZE = 12

export default async function AuthorsPage({ searchParams }: AuthorsPageProps) {
  const params = await authorSearchParamsCache.parse(searchParams)
  const isAdmin = await checkRole('admin')

  const { authors, totalCount } = await getAuthors({
    limit: DEFAULT_PAGE_SIZE,
    offset: (Number(params.page) - 1) * DEFAULT_PAGE_SIZE,
    search: params.q
  })

  // Calculate page count
  const pageCount = Math.ceil(totalCount / DEFAULT_PAGE_SIZE)

  return (
    <div className='container mx-auto py-8 mt-20'>
      <div className='flex flex-col justify-between mb-5 w-full'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-semibold tracking-tight'>Authors</h2>
            <p className='text-muted-foreground'>
              Browse and discover your favorite authors.
            </p>
          </div>

          {isAdmin && (
            <Button size='sm' className='gap-1' asChild>
              <Link href='/forms/authors'>
                <PlusIcon className='h-4 w-4' />
                <span>Add Author</span>
              </Link>
            </Button>
          )}
        </div>

        <Separator className='my-4' />

        <AuthorsSearch />
      </div>

      {authors.length === 0 ? (
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
                d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
              />
            </svg>
            <h3 className='mt-4 text-lg font-semibold'>No authors found</h3>
            <p className='mt-2 text-sm text-muted-foreground'>
              Try adjusting your search to find what you&apos;re looking for.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className='min-h-[70vh]'>
            <AuthorList authors={authors} />
          </div>

          {totalCount > DEFAULT_PAGE_SIZE && (
            <div className='mt-8'>
              <AuthorPagination
                currentPage={Number(params.page)}
                pageCount={pageCount}
                totalCount={totalCount}
                pageSize={DEFAULT_PAGE_SIZE}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
