import { getOrders } from '@/app/actions/orders.actions'
import { orderSearchParamsCache } from '@/app/user/dashboard/orders/searchParams'
import { OrderCard } from '@/components/orders/order-card/OrderCard'
import { OrdersPagination } from '@/components/orders/orders-pagiantion/OrdersPagination'
import { OrdersSearch } from '@/components/orders/orders-search/OrdersSearch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SearchParams } from 'nuqs/server'

const DEFAULT_PAGE_SIZE = 6

interface AdminOrdersPageProps {
  searchParams: Promise<SearchParams>
}

export default async function AdminOrdersPage({
  searchParams
}: AdminOrdersPageProps) {
  const params = await orderSearchParamsCache.parse(searchParams)

  const { orders, totalCount, pageCount } = await getOrders({
    limit: DEFAULT_PAGE_SIZE,
    offset: (Number(params.page) - 1) * DEFAULT_PAGE_SIZE,
    search: params.q
  })

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
        <CardContent className='space-y-6'>
          <OrdersSearch />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          {orders.length === 0 && (
            <div className='rounded-lg border bg-card text-card-foreground shadow-sm'>
              <div className='p-6 text-center text-muted-foreground'>
                No orders found.
              </div>
            </div>
          )}

          {totalCount > DEFAULT_PAGE_SIZE && (
            <div className='mt-8'>
              <OrdersPagination
                currentPage={Number(params.page)}
                pageCount={pageCount}
                totalCount={totalCount}
                pageSize={DEFAULT_PAGE_SIZE}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
