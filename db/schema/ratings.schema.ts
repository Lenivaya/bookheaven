import { relations } from 'drizzle-orm'
import { integer, pgTable, text, unique, uuid } from 'drizzle-orm/pg-core'
import { bookEditions } from './books.schema'
import { timestamps } from './columns.helpers'

export type RatingValue = 1 | 2 | 3 | 4 | 5

export const ratings = pgTable(
  'ratings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    editionId: uuid('edition_id')
      .notNull()
      .references(() => bookEditions.id, {
        onDelete: 'cascade'
      }),
    userId: text('user_id').notNull(),
    rating: integer('rating').notNull().$type<RatingValue>(),
    ...timestamps
  },
  (t) => [unique().on(t.userId, t.editionId)]
)

// Relations
export const ratingsRelations = relations(ratings, ({ one }) => ({
  edition: one(bookEditions, {
    fields: [ratings.editionId],
    references: [bookEditions.id]
  })
}))

export type Rating = typeof ratings.$inferSelect
