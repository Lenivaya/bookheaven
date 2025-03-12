import { relations } from 'drizzle-orm'
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  unique,
  uuid
} from 'drizzle-orm/pg-core'
import { bookEditions } from './books.schema'
import { createInsertSchema, timestamps } from './columns.helpers'

export const reviews = pgTable(
  'reviews',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    editionId: uuid('edition_id')
      .notNull()
      .references(() => bookEditions.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    content: text('content').notNull(),
    isVerifiedPurchase: boolean('is_verified_purchase').default(false),
    likesCount: integer('likes_count').default(0),
    ...timestamps
  },
  (t) => [unique().on(t.userId, t.editionId)]
)

// Like tracking
export const reviewLikes = pgTable(
  'review_likes',
  {
    reviewId: uuid('review_id')
      .notNull()
      .references(() => reviews.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    ...timestamps
  },
  (t) => [primaryKey({ columns: [t.reviewId, t.userId] })]
)

// Relations
export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  edition: one(bookEditions, {
    fields: [reviews.editionId],
    references: [bookEditions.id]
  }),
  likes: many(reviewLikes)
}))

export const reviewLikesRelations = relations(reviewLikes, ({ one }) => ({
  review: one(reviews, {
    fields: [reviewLikes.reviewId],
    references: [reviews.id]
  })
}))

export type Review = typeof reviews.$inferSelect

export const reviewCreateSchema = createInsertSchema(reviews)
