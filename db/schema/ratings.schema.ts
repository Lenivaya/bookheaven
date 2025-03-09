import { relations } from 'drizzle-orm'
import { integer, pgTable, text, unique, uuid } from 'drizzle-orm/pg-core'
import { bookEditions, bookWorks } from './books.schema'
import { timestamps } from './columns.helpers'

export type RatingValue = 1 | 2 | 3 | 4 | 5

export const ratings = pgTable(
  'ratings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    workId: uuid('work_id')
      .notNull()
      .references(() => bookWorks.id, { onDelete: 'cascade' }),
    editionId: uuid('edition_id').references(() => bookEditions.id, {
      onDelete: 'cascade'
    }),
    userId: text('user_id').notNull(),
    rating: integer('rating').notNull().$type<RatingValue>(),
    review: text('review'),
    ...timestamps
  },
  (t) => [unique().on(t.userId, t.workId, t.editionId)]
)

// Relations
export const ratingsRelations = relations(ratings, ({ one }) => ({
  work: one(bookWorks, {
    fields: [ratings.workId],
    references: [bookWorks.id]
  }),
  edition: one(bookEditions, {
    fields: [ratings.editionId],
    references: [bookEditions.id]
  })
}))
