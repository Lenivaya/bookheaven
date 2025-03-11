'use client'

import { ShoppingCartSheet } from '@/components/shopping/shopping-cart-sheet/ShoppingCartSheet'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useShoppingCart } from 'use-shopping-cart'

export function NavbarCart() {
  const { cartCount, formattedTotalPrice } = useShoppingCart()

  return (
    <ShoppingCartSheet>
      <Button
        variant='ghost'
        size='sm'
        className='relative flex items-center gap-2'
        aria-label={`Shopping cart`}
      >
        <ShoppingCart className='h-5 w-5' />
        {cartCount && cartCount > 0 && (
          <>
            <span className='absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground'>
              {cartCount}
            </span>
            <span className='ml-2 text-sm font-semibold hidden sm:inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-primary/10 text-primary'>
              {formattedTotalPrice}
            </span>
          </>
        )}
      </Button>
    </ShoppingCartSheet>
  )
}
