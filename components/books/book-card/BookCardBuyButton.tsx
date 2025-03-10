'use client'

import { Button } from '@/components/ui/button'
import { BookEdition, BookWork } from '@/db/schema'
import { getProductFromBookEdition } from '@/lib/stripe/books.stripe.metadata'
import { ShoppingCart } from 'lucide-react'
import { useShoppingCart } from 'use-shopping-cart'

export function BookCardBuyButton({
  bookEdition,
  bookWork
}: {
  bookEdition: BookEdition
  bookWork: BookWork
}) {
  const { addItem } = useShoppingCart()

  const handleAddItem = () => {
    addItem(getProductFromBookEdition(bookEdition, bookWork), { count: 1 })
  }

  return (
    <Button
      size='sm'
      variant='outline'
      className='h-7 px-2.5 text-xs font-medium border-primary/20 hover:bg-primary/10 hover:border-primary/30'
      onClick={(e) => {
        e.preventDefault()
        handleAddItem()
      }}
    >
      <ShoppingCart className='mr-1 h-3.5 w-3.5' />
      Buy
    </Button>
  )
}
