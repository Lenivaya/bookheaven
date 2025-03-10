'use client'

import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'

export function BookCardBuyButton() {
  return (
    <Button
      size='sm'
      variant='outline'
      className='h-7 px-2.5 text-xs font-medium border-primary/20 hover:bg-primary/10 hover:border-primary/30'
      onClick={(e) => {
        e.preventDefault()
      }}
    >
      <ShoppingCart className='mr-1 h-3.5 w-3.5' />
      Buy
    </Button>
  )
}
