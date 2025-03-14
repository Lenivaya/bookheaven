import { FetchedOrderRelations } from '@/app/actions/orders.actions'
import { Package } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { Link } from 'next-view-transitions'

import { cn } from '@/lib/utils'

interface OrderCardBooksProps {
  items: FetchedOrderRelations['items']
}

export function OrderCardBooks({ items }: OrderCardBooksProps) {
  return (
    <div className='space-y-3'>
      <h3 className='font-medium text-base text-foreground flex items-center gap-2'>
        <Package className='h-4 w-4 text-amber-500' />
        Items in Order
      </h3>
      <ul className='space-y-3'>
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/books/${item.bookEdition.id}`}
            className='block'
          >
            <li
              className={cn(
                'flex items-start gap-3 group rounded-lg p-2 -mx-2',
                'hover:bg-muted/50 transition-colors'
              )}
            >
              <Package className='h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0 group-hover:text-amber-500 transition-colors' />
              <div className='flex-1 min-w-0'>
                <div className='flex justify-between gap-4'>
                  <div className='space-y-1.5'>
                    <p className='text-sm font-medium text-foreground truncate group-hover:text-amber-500 transition-colors'>
                      {item.bookEdition.work.title}
                    </p>
                    <div className='space-y-0.5'>
                      <p className='text-xs text-muted-foreground'>
                        {item.bookEdition.format} • {item.bookEdition.publisher}
                      </p>
                      {item.bookEdition.isbn && (
                        <p className='text-xs text-muted-foreground font-mono'>
                          ISBN: {item.bookEdition.isbn}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className='text-right flex-shrink-0'>
                    <p className='text-sm font-medium text-foreground'>
                      {formatCurrency(Number(item.price))}
                    </p>
                    {item.quantity > 1 && (
                      <p className='text-xs text-muted-foreground'>
                        {item.quantity} ×{' '}
                        {formatCurrency(Number(item.price) / item.quantity)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  )
}
