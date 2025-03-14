import { getAuthors } from '@/app/actions/authors.actions'
import { authorSearchParamsCache } from '@/app/authors/searchParams'
import { AuthorsSearch } from '@/components/authors/author-search/AuthorsSearch'
import { AuthorPagination } from '@/components/authors/author-pagination/AuthorPagination'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SearchParams } from 'nuqs/server'
import AuthorList from '@/components/authors/author-list/AuthorList'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { Link } from 'next-view-transitions'

const DEFAULT_PAGE_SIZE = 12

interface AdminAuthorsPageProps {
  searchParams: Promise<SearchParams>
}

export default async function AdminAuthorsPage({
  searchParams
}: AdminAuthorsPageProps) {
  const params = await authorSearchParamsCache.parse(searchParams)

  const { authors, totalCount, pageCount } = await getAuthors({
    limit: DEFAULT_PAGE_SIZE,
    offset: (Number(params.page) - 1) * DEFAULT_PAGE_SIZE,
    search: params.q
  })

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-semibold tracking-tight'>Authors</h2>
          <p className='text-muted-foreground'>
            Manage authors and their information.
          </p>
        </div>

        <Button size='sm' className='gap-1' asChild>
          <Link href='/forms/authors'>
            <PlusIcon className='h-4 w-4' />
            <span>Add Author</span>
          </Link>
        </Button>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Authors Management</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <AuthorsSearch />

          <div className='min-h-[70vh]'>
            <AuthorList
              authors={authors}
              layout='narrow'
              showAdminActions={true}
            />
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

          {authors.length === 0 && (
            <div className='rounded-lg border bg-card text-card-foreground shadow-sm'>
              <div className='p-6 text-center text-muted-foreground'>
                No authors found.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
