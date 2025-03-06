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
import { bookEditions, bookWorks } from './books.schema'
import { timestamps } from './columns.helpers'

export const reviews = pgTable(
  'reviews',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    workId: uuid('work_id')
      .notNull()
      .references(() => bookWorks.id, { onDelete: 'cascade' }),
    editionId: uuid('edition_id').references(() => bookEditions.id, {
      onDelete: 'cascade'
    }),
    userId: text('user_id').notNull(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    isVerifiedPurchase: boolean('is_verified_purchase').default(false),
    likesCount: integer('likes_count').default(0),
    ...timestamps
  },
  (t) => [unique().on(t.userId, t.workId, t.editionId)]
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
  work: one(bookWorks, {
    fields: [reviews.workId],
    references: [bookWorks.id]
  }),
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
