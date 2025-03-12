import { FetchedOrderRelations } from '@/app/actions/orders.actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { CopyableText } from '@/components/ui/copyable-text'
import { Separator } from '@/components/ui/separator'
import { cn, formatCurrency } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { MapPin, Receipt } from 'lucide-react'
import Link from 'next/link'
import { OrderCardBooks } from './OrderCardBooks'
import { OrderCardCancelButton } from './OrderCardCancelButton'

interface OrderCardProps {
  order: FetchedOrderRelations
}

const statusColorMap = {
  Created: 'bg-blue-500',
  Delivering: 'bg-yellow-500',
  Delivered: 'bg-green-500',
  Cancelled: 'bg-red-500'
} as const

function formatOrderNumber(id: string): string {
  // Take first 4 and last 4 characters of the ID
  const prefix = id.slice(0, 4)
  const suffix = id.slice(-4)
  return `${prefix}-${suffix}`.toUpperCase()
}

export function OrderCard({ order }: OrderCardProps) {
  const formattedDate = formatDistanceToNow(new Date(order.created_at), {
    addSuffix: true
  })

  if (!order.shippingAddress?.address) {
    return null
  }

  const { address } = order.shippingAddress
  const formattedAddress = [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.postal_code,
    address.country
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <Card className='hover:shadow-lg transition-all duration-200 border-zinc-200 dark:border-zinc-800/50'>
      <CardHeader className='space-y-4'>
        <div className='flex items-start justify-between'>
          <div className='space-y-1.5'>
            <div className='flex items-center gap-2'>
              <Receipt className='h-4 w-4 text-amber-500' />
              <CardTitle className='text-base font-medium flex items-center gap-1'>
                Order #
                <CopyableText
                  text={order.id}
                  displayText={formatOrderNumber(order.id)}
                  className='hover:text-amber-500 transition-colors'
                />
              </CardTitle>
            </div>
            <div className='flex flex-col gap-1'>
              <CardDescription>Placed {formattedDate}</CardDescription>
              <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                <span className='font-medium'>Session ID:</span>
                <CopyableText
                  text={order.stripeSessionId}
                  displayText={order.stripeSessionId.substring(0, 16) + '...'}
                  className='font-mono hover:text-foreground transition-colors'
                />
              </div>
            </div>
          </div>
          <Badge
            variant='secondary'
            className={cn(
              'text-white font-medium',
              statusColorMap[order.status]
            )}
          >
            {order.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className='space-y-6'>
        <OrderCardBooks items={order.items} />

        <Separator />

        <div className='space-y-2'>
          <div className='flex items-start gap-2 text-sm text-muted-foreground'>
            <MapPin className='h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0' />
            <div className='space-y-1'>
              <p className='font-medium text-foreground'>Shipping Address</p>
              <p className='leading-relaxed'>{formattedAddress}</p>
            </div>
          </div>
        </div>

        <div className='flex justify-between items-center py-2'>
          <span className='font-medium text-foreground'>Total</span>
          <span className='font-semibold text-lg'>
            {formatCurrency(Number(order.total))}
          </span>
        </div>
      </CardContent>

      <CardFooter className='flex justify-end gap-3'>
        <OrderCardCancelButton orderId={order.id} />
        <Button variant='outline' asChild>
          <Link href={`/user/dashboard/orders/${order.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
