'use client'

import { env } from '@/env'
import { CartProvider } from 'use-shopping-cart'

export function ShoppingStripeCartProvider({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider
      // @ts-expect-error <idc>
      mode='checkout-session'
      cartMode='checkout-session'
      stripe={env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
      currency='USD'
    >
      {children}
    </CartProvider>
  )
}
