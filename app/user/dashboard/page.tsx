import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function DashboardPage() {
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

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Total Orders</CardTitle>
            <CardDescription>Your lifetime orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Liked Books</CardTitle>
            <CardDescription>Books you&apos;ve liked</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Book Shelves</CardTitle>
            <CardDescription>Your custom shelves</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>0</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className='text-lg font-medium mb-4'>Recent Activity</h3>
        <div className='rounded-lg border bg-card text-card-foreground shadow-sm'>
          <div className='p-6 text-center text-muted-foreground'>
            No recent activity to display.
          </div>
        </div>
      </div>
    </div>
  )
}
