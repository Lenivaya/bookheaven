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

  const line_items = validateCartItems(inventory, product)
  const checkoutSession = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    billing_address_collection: 'auto',
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'UA', 'GB', 'AU', 'NZ', 'IE', 'ZA', 'RU']
    },
    success_url: `${env.NEXT_PUBLIC_APP_URL}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/payments/cancel`
  })

  return checkoutSession.id
}

export const retrieveCheckoutSession = async (sessionId: string) => {
  if (!sessionId) return null

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product']
    })

    return session
  } catch (error) {
    console.error('Error retrieving checkout session:', error)
    return null
  }
}
