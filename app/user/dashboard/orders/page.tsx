import { Separator } from '@/components/ui/separator'

export default function OrdersPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight'>Orders</h2>
        <p className='text-muted-foreground'>
          View and manage your book orders.
        </p>
      </div>

      <Separator />

      <div className='rounded-lg border bg-card text-card-foreground shadow-sm'>
        <div className='p-6 text-center text-muted-foreground'>
          You haven&apos;t placed any orders yet.
        </div>
      </div>
    </div>
  )
}
