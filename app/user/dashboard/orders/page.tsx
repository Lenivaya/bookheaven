import { getOrders } from '@/app/actions/orders.actions'
import { Separator } from '@/components/ui/separator'
import { SearchParams } from 'nuqs/server'
import { orderSearchParamsCache } from './searchParams'
import { OrdersSearch } from '@/components/orders/orders-search/OrdersSearch'
import { OrderCard } from '@/components/orders/order-card/OrderCard'
import { OrdersPagination } from '@/components/orders/orders-pagiantion/OrdersPagination'
import { auth } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'

const DEFAULT_PAGE_SIZE = 6

interface OrdersPageProps {
  searchParams: Promise<SearchParams>
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await orderSearchParamsCache.parse(searchParams)

  const { userId } = await auth()
  if (!userId) {
    notFound()
  }

  const { orders, totalCount, pageCount } = await getOrders({
    limit: DEFAULT_PAGE_SIZE,
    offset: (Number(params.page) - 1) * DEFAULT_PAGE_SIZE,
    search: params.q,
    userIds: [userId]
  })

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight'>Orders</h2>
        <p className='text-muted-foreground'>
          View and manage your book orders.
        </p>
      </div>

      <Separator />

      <OrdersSearch />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
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

      {orders.length < 0 && (
        <div className='rounded-lg border bg-card text-card-foreground shadow-sm'>
          <div className='p-6 text-center text-muted-foreground'>
            You haven&apos;t placed any orders yet.
          </div>
        </div>
      )}
    </div>
  )
}
