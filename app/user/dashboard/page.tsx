import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getUserDashboardData } from './dashboard.actions'
import { BookMarked, Heart, ShoppingBag, TimerIcon } from 'lucide-react'

export default async function DashboardPage() {
  const { ordersCount, likedBooksCount, bookShelvesCount, totalReviewsCount } =
    await getUserDashboardData()

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight'>Dashboard</h2>
        <p className='text-muted-foreground'>
          Welcome to your BookHeaven dashboard. Manage your orders, books, and
          reviews.
        </p>
      </div>

      <Separator />

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-2'>
        <Card>
          <CardHeader className='pb-2'>
            <div className='flex items-center gap-2'>
              <ShoppingBag className='h-4 w-4 text-muted-foreground' />
              <CardTitle className='text-sm font-medium'>
                Total Orders
              </CardTitle>
            </div>
            <CardDescription>Your lifetime orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{ordersCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <div className='flex items-center gap-2'>
              <Heart className='h-4 w-4 text-muted-foreground' />
              <CardTitle className='text-sm font-medium'>Liked Books</CardTitle>
            </div>
            <CardDescription>Books you&apos;ve liked</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{likedBooksCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <div className='flex items-center gap-2'>
              <BookMarked className='h-4 w-4 text-muted-foreground' />
              <CardTitle className='text-sm font-medium'>
                Book Shelves
              </CardTitle>
            </div>
            <CardDescription>Your created book shelves</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{bookShelvesCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <div className='flex items-center gap-2'>
              <TimerIcon className='h-4 w-4 text-muted-foreground' />
              <CardTitle className='text-sm font-medium'>Reviews</CardTitle>
            </div>
            <CardDescription>Total reviews you&apos;ve written</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalReviewsCount}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
