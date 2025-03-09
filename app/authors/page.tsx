import { getAuthors } from '@/app/actions/authors.actions'
import AuthorCard from '@/components/authors/author-card/AuthorCard'
import { AuthorsSearch } from '@/components/authors/author-search/AuthorsSearch'
import { SearchParams } from 'nuqs/server'
import { authorSearchParamsCache } from './searchParams'
import { AuthorPagination } from '@/components/authors/author-pagination/AuthorPagination'

interface AuthorsPageProps {
  searchParams: Promise<SearchParams>
}

const DEFAULT_PAGE_SIZE = 12

export default async function AuthorsPage({ searchParams }: AuthorsPageProps) {
  const params = await authorSearchParamsCache.parse(searchParams)

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
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {authors.map((author) => (
                <AuthorCard
                  key={author.id}
                  author={author}
                  // In a real implementation, you would check if the user is following the author
                  isFollowing={false}
                />
              ))}
            </div>
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
