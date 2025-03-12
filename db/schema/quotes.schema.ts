import { relations } from 'drizzle-orm'
import {
  integer,
  pgTable,
  primaryKey,
  text,
  unique,
  uuid
} from 'drizzle-orm/pg-core'
import { bookEditions, bookWorks } from './books.schema'
import { createInsertSchema, timestamps } from './columns.helpers'

export const quotes = pgTable(
  'quotes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    workId: uuid('work_id')
      .notNull()
      .references(() => bookWorks.id, { onDelete: 'cascade' }),
    editionId: uuid('edition_id').references(() => bookEditions.id, {
      onDelete: 'set null'
    }),
    userId: text('user_id').notNull(),
    content: text('content').notNull(),
    page: integer('page'),
    chapter: text('chapter'),
    context: text('context'), // Optional context or note about the quote
    likesCount: integer('likes_count').default(0),
    ...timestamps
  },
  (t) => [unique().on(t.userId, t.workId, t.editionId)]
)

// Track quote likes
export const quoteLikes = pgTable(
  'quote_likes',
  {
    quoteId: uuid('quote_id')
      .notNull()
      .references(() => quotes.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    ...timestamps
  },
  (t) => [primaryKey({ columns: [t.quoteId, t.userId] })]
)

// Relations
export const quotesRelations = relations(quotes, ({ one, many }) => ({
  work: one(bookWorks, {
    fields: [quotes.workId],
    references: [bookWorks.id]
  }),
  edition: one(bookEditions, {
    fields: [quotes.editionId],
    references: [bookEditions.id]
  }),
  likes: many(quoteLikes)
}))

export const quoteLikesRelations = relations(quoteLikes, ({ one }) => ({
  quote: one(quotes, {
    fields: [quoteLikes.quoteId],
    references: [quotes.id]
  })
}))

export const insertQuoteSchema = createInsertSchema(quotes)
