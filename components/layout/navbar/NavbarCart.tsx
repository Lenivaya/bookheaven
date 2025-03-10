'use client'

import { ShoppingCartSheet } from '@/components/shopping/shopping-cart-sheet/ShoppingCartSheet'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useShoppingCart } from 'use-shopping-cart'

export function NavbarCart() {
  const { cartCount } = useShoppingCart()

  return (
    <ShoppingCartSheet>
      <Button
        variant='ghost'
        size='sm'
        className='relative flex items-center gap-2'
        aria-label={`Shopping cart with ${cartCount} items`}
      >
        <ShoppingCart className='h-5 w-5' />
        {cartCount && cartCount > 0 && (
          <span className='absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground'>
            {cartCount}
          </span>
        )}
      </Button>
    </ShoppingCartSheet>
  )
}
