'use server'

import { db } from '@/db'
import { BookEdition, BookWork } from '@/db/schema'
import { getProductFromBookEdition } from '@/lib/stripe/books.stripe.metadata'
import { CartDetails } from 'use-shopping-cart/core'
import { validateCartItems } from 'use-shopping-cart/utilities'
import Stripe from 'stripe'
import { env } from '@/env'

const stripe = new Stripe(env.STRIPE_SECRET_KEY)

export const createCheckoutSessionForBookEditions = async (
  product: CartDetails
) => {
  const ids = Object.keys(product)
  console.log('ids', ids)

  const foundProductsInDb = (await db.query.bookEditions.findMany({
    where: (bookEditions, { inArray }) => inArray(bookEditions.id, ids),
    with: {
      work: true
    }
  })) as (BookEdition & {
    work: BookWork
  })[]
  const inventory = foundProductsInDb.map((product) =>
    getProductFromBookEdition(product, product.work)
  )
  console.log('inventory', inventory)

  const line_items = validateCartItems(inventory, product)
  console.log('line_items', line_items)

  const checkoutSession = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    success_url: `${env.NEXT_PUBLIC_APP_URL}/payments/success`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/payments/cancel`
  })

  return checkoutSession.id
}
