import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function AdminOrdersPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight'>User Orders</h2>
        <p className='text-muted-foreground'>
          View and manage all user orders in the system.
        </p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Orders Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>
            Order list will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
