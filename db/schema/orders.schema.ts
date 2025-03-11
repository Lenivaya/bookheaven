import { relations } from 'drizzle-orm'
import {
  decimal,
  integer,
  jsonb,
  pgTable,
  text,
  uuid
} from 'drizzle-orm/pg-core'
import { bookEditions } from './books.schema'
import { timestamps } from './columns.helpers'
import Stripe from 'stripe'

export type OrderStatus = 'Created' | 'Delivering' | 'Delivered' | 'Cancelled'

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull().$type<OrderStatus>().default('Created'),
  shippingAddress: jsonb('shipping_address')
    .notNull()
    .$type<Stripe.Checkout.Session.ShippingDetails>(),
  stripeSessionId: text('stripe_session_id').notNull(),
  ...timestamps
})

export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  bookEditionId: uuid('book_edition_id')
    .notNull()
    .references(() => bookEditions.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  ...timestamps
})

export const orderRelations = relations(orders, ({ many }) => ({
  items: many(orderItems)
}))

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  bookEdition: one(bookEditions, {
    fields: [orderItems.bookEditionId],
    references: [bookEditions.id]
  })
}))

export type Order = typeof orders.$inferSelect
export type OrderItem = typeof orderItems.$inferSelect
