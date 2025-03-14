import { Link } from 'next-view-transitions'
import { CheckCircle2, Package, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { retrieveCheckoutSession } from '@/app/actions/payments.actions'
import { formatCurrency } from '@/lib/utils'
import { CopyableText } from '@/components/ui/copyable-text'

interface PaymentsSuccessProps {
  searchParams: Promise<{ session_id: string }>
}

export default async function PaymentsSuccess({
  searchParams
}: PaymentsSuccessProps) {
  const { session_id: sessionId } = await searchParams
  const session = sessionId ? await retrieveCheckoutSession(sessionId) : null

  const items = session?.line_items?.data || []
  const totalAmount = session?.amount_total
    ? formatCurrency(session.amount_total / 100)
    : '$0.00'
  const customerEmail = session?.customer_details?.email || ''
  const orderDate = session?.created
    ? new Date(session.created * 1000).toLocaleDateString()
    : ''
  const customerName = session?.customer_details?.name || ''
  const itemCount = items.reduce((acc, item) => acc + (item.quantity || 0), 0)

  // Format shipping address if it exists
  const shippingAddress = session?.shipping_details?.address
  const formattedAddress = shippingAddress
    ? [
        shippingAddress.line1,
        shippingAddress.line2,
        shippingAddress.city,
        shippingAddress.state,
        shippingAddress.postal_code,
        shippingAddress.country
      ]
        .filter(Boolean)
        .join(', ')
    : null

  return (
    <div className='min-h-screen w-full bg-gradient-to-b from-black to-zinc-950 overflow-auto py-20'>
      <div className='container mx-auto px-4 flex justify-center'>
        <Card className='w-full max-w-xl border-zinc-800/50 bg-black/95 backdrop-blur-sm shadow-2xl my-10'>
          <CardHeader className='text-center pb-6 pt-10 space-y-5'>
            <div className='flex justify-center'>
              <div className='rounded-full bg-green-500/10 p-3.5 ring-3 ring-green-500/20'>
                <CheckCircle2 className='h-10 w-10 text-green-500' />
              </div>
            </div>
            <div className='space-y-1.5'>
              <CardTitle className='text-2xl font-semibold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent'>
                Payment Successful!
              </CardTitle>
              <CardDescription className='text-zinc-400 text-base'>
                Thank you for your purchase at BookHeaven
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className='space-y-7 px-5 sm:px-6'>
            <p className='text-zinc-400 text-center text-sm leading-relaxed max-w-md mx-auto'>
              Your order has been processed successfully. You will receive a
              confirmation email shortly with details of your purchase.
            </p>

            {session && (
              <>
                <Separator className='bg-zinc-800/50' />

                <div className='space-y-5'>
                  <div>
                    <h3 className='flex items-center gap-2 text-white mb-3.5 font-medium text-base'>
                      <Package className='h-4.5 w-4.5 text-amber-200' />
                      Order Summary
                    </h3>
                    <div className='text-sm space-y-2.5 bg-zinc-950/50 rounded-lg p-3.5 border border-zinc-800/50'>
                      {customerName && (
                        <p className='flex'>
                          <span className='w-26 text-zinc-400 font-medium'>
                            Name:
                          </span>
                          <span className='text-zinc-100'>{customerName}</span>
                        </p>
                      )}
                      <p className='flex'>
                        <span className='w-26 text-zinc-400 font-medium'>
                          Order Date:
                        </span>
                        <span className='text-zinc-100'>{orderDate}</span>
                      </p>
                      <p className='flex'>
                        <span className='w-26 text-zinc-400 font-medium'>
                          Email:
                        </span>
                        <span className='text-zinc-100'>{customerEmail}</span>
                      </p>
                      <p className='flex items-center'>
                        <span className='w-26 text-zinc-400 font-medium'>
                          Order ID:
                        </span>
                        <CopyableText
                          text={session.id}
                          displayText={session.id.substring(0, 20) + '...'}
                          className='font-mono text-xs text-zinc-300 hover:text-zinc-100 transition-colors'
                        />
                      </p>
                      <p className='flex'>
                        <span className='w-26 text-zinc-400 font-medium'>
                          Items:
                        </span>
                        <span className='text-zinc-100'>{itemCount}</span>
                      </p>
                      {formattedAddress && (
                        <div className='flex pt-1'>
                          <span className='w-26 text-zinc-400 font-medium flex items-center gap-1.5'>
                            <MapPin className='h-3.5 w-3.5 text-amber-200' />
                            Shipping:
                          </span>
                          <span className='text-zinc-100 flex-1 leading-relaxed'>
                            {formattedAddress}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {items.length > 0 && (
                    <div>
                      <h3 className='font-medium text-base text-white mb-3.5 flex items-center gap-2'>
                        <Package className='h-4.5 w-4.5 text-amber-200' />
                        Items Purchased
                      </h3>
                      <ul className='space-y-2.5 bg-zinc-950/50 rounded-lg p-3.5 border border-zinc-800/50'>
                        {items.map((item) => (
                          <li
                            key={item.id}
                            className='flex items-start gap-3.5 group'
                          >
                            <Package className='h-4.5 w-4.5 text-zinc-500 mt-0.5 flex-shrink-0 group-hover:text-amber-200 transition-colors' />
                            <div className='flex-1 min-w-0'>
                              <div className='flex justify-between gap-3.5 text-sm'>
                                <p className='text-zinc-100 truncate'>
                                  {item.description}
                                </p>
                                {item.amount_total && (
                                  <span className='text-zinc-100 flex-shrink-0'>
                                    {formatCurrency(item.amount_total / 100)}
                                  </span>
                                )}
                              </div>
                              {item.quantity && item.quantity > 1 && (
                                <p className='text-xs text-zinc-500 mt-0.5'>
                                  {item.quantity} ×{' '}
                                  {formatCurrency(
                                    (item.amount_total || 0) /
                                      (item.quantity * 100)
                                  )}
                                </p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className='flex justify-between items-center py-3.5 px-3.5 bg-zinc-950/50 rounded-lg border border-zinc-800/50'>
                    <span className='font-medium text-base text-zinc-300'>
                      Total
                    </span>
                    <span className='font-semibold text-lg text-white'>
                      {totalAmount}
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className='flex flex-col gap-2.5 px-5 sm:px-6 pb-7 pt-5'>
            <Button
              asChild
              className='w-full bg-gradient-to-br from-amber-200 to-amber-100 text-black hover:from-amber-100 hover:to-amber-50 h-11 font-medium shadow-lg shadow-amber-950/10 transition-all duration-300'
            >
              <Link href='/books'>Continue Exploring Books</Link>
            </Button>
            <Button
              variant='outline'
              asChild
              className='w-full border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 h-11 transition-all duration-300'
            >
              <Link href='/user/dashboard/orders'>View My Orders</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
