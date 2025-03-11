import type { Stripe } from 'stripe'

import { NextResponse } from 'next/server'

import { stripe } from '@/lib/stripe/stripe'
import { db } from '@/db'
import { orders, orderItems } from '@/db/schema/orders.schema'
import { isNone } from '@/lib/types'
import { convertToDollars } from '@/lib/stripe/books.stripe.metadata'

export async function POST(req: Request) {
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get('stripe-signature') as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    )
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    // On error, log and return the error message.
    if (err! instanceof Error) console.log(err)
    console.log(`❌ Error message: ${errorMessage}`)
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    )
  }

  // Successfully constructed event.
  console.log('✅ Success:', event.id)

  const permittedEvents: string[] = [
    'checkout.session.completed',
    'payment_intent.succeeded',
    'payment_intent.payment_failed'
  ]

  if (permittedEvents.includes(event.type)) {
    let data

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          data = event.data.object as Stripe.Checkout.Session
          handleCheckoutSessionCompleted(data)
          console.log(`💰 CheckoutSession status: ${data.payment_status}`)
          break
        case 'payment_intent.payment_failed':
          data = event.data.object as Stripe.PaymentIntent
          console.log(`❌ Payment failed: ${data.last_payment_error?.message}`)
          break
        case 'payment_intent.succeeded':
          data = event.data.object as Stripe.PaymentIntent
          console.log(`💰 PaymentIntent status: ${data.status}`)
          break
        default:
          throw new Error(`Unhandled event: ${event.type}`)
      }
    } catch (error) {
      console.log(error)
      return NextResponse.json(
        { message: 'Webhook handler failed' },
        { status: 500 }
      )
    }
  }
  // Return a response to acknowledge receipt of the event.
  return NextResponse.json({ message: 'Received' }, { status: 200 })
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.userId
  if (isNone(session) || isNone(userId)) {
    throw new Error('No user ID in session metadata')
  }

  // Retrieve line items with expanded product data to get metadata
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ['data.price.product']
  })

  await db.transaction(async (tx) => {
    const [order] = await tx
      .insert(orders)
      .values({
        userId,
        total: String(convertToDollars(session.amount_total!)),
        status: 'Created',
        stripeSessionId: session.id,
        shippingAddress: session.shipping_details!
      })
      .returning()

    const orderItemsData = lineItems.data.map((item) => ({
      orderId: order.id,
      bookEditionId: (item.price?.product as Stripe.Product).metadata.dbId,
      quantity: item.quantity || 1,
      price: String(convertToDollars(item.amount_total!))
    }))

    await tx.insert(orderItems).values(orderItemsData)
  })
  console.log(`💰 Order created ${session.id} for user ${userId}`)
}
