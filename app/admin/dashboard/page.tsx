import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { BookIcon, PackageIcon, UsersIcon } from 'lucide-react'

export default function AdminDashboardPage() {
  // Mock data - in real implementation, this would come from the database
  const stats = {
    totalOrders: 156,
    totalAuthors: 45,
    totalBooks: 234
  }

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
            <div className='text-2xl font-bold'>{stats.totalOrders}</div>
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
            <div className='text-2xl font-bold'>{stats.totalAuthors}</div>
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
            <div className='text-2xl font-bold'>{stats.totalBooks}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
