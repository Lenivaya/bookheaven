import { getAdminDashboardData } from '@/components/admin/dashboard/dashboard-navigation/dashboard.actions'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  BookIcon,
  BookmarkIcon,
  HeartIcon,
  PackageIcon,
  TagIcon,
  UsersIcon
} from 'lucide-react'

export default async function AdminDashboardPage() {
  const {
    ordersCount,
    authorsCount,
    booksCount,
    bookShelvesCount,
    totalReviewsCount,
    totalTagsCount
  } = await getAdminDashboardData()

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight'>Overview</h2>
        <p className='text-muted-foreground'>
          Welcome to the BookHeaven admin dashboard. Manage orders, authors, and
          books.
        </p>
      </div>

      <Separator />

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader className='pb-2'>
            <div className='flex items-center gap-2'>
              <PackageIcon className='h-4 w-4 text-muted-foreground' />
              <CardTitle className='text-sm font-medium'>
                Total Orders
              </CardTitle>
            </div>
            <CardDescription>All user orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{ordersCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <div className='flex items-center gap-2'>
              <UsersIcon className='h-4 w-4 text-muted-foreground' />
              <CardTitle className='text-sm font-medium'>Authors</CardTitle>
            </div>
            <CardDescription>Total registered authors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{authorsCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <div className='flex items-center gap-2'>
              <BookIcon className='h-4 w-4 text-muted-foreground' />
              <CardTitle className='text-sm font-medium'>Books</CardTitle>
            </div>
            <CardDescription>Total books in catalog</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{booksCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <div className='flex items-center gap-2'>
              <BookmarkIcon className='h-4 w-4 text-muted-foreground' />
              <CardTitle className='text-sm font-medium'>
                Book Shelves
              </CardTitle>
            </div>
            <CardDescription>Total user book shelves</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{bookShelvesCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <div className='flex items-center gap-2'>
              <HeartIcon className='h-4 w-4 text-muted-foreground' />
              <CardTitle className='text-sm font-medium'>Reviews</CardTitle>
            </div>
            <CardDescription>Total user reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalReviewsCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <div className='flex items-center gap-2'>
              <TagIcon className='h-4 w-4 text-muted-foreground' />
              <CardTitle className='text-sm font-medium'>Tags</CardTitle>
            </div>
            <CardDescription>Total book tags</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalTagsCount}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
