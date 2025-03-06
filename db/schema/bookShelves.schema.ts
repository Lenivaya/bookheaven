import { relations } from 'drizzle-orm'
import { boolean, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core'
import { bookEditions, bookWorks } from './books.schema'
import { timestamps } from './columns.helpers'

// Bookshelves table
export const shelves = pgTable('shelves', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(), // Currently reading, to read, favorites, etc.
  description: text('description'),
  isPublic: boolean('is_public').default(false),
  ...timestamps
})

// Books in shelves - allows same book to be in multiple shelves
export const shelfItems = pgTable(
  'shelf_items',
  {
    shelfId: uuid('shelf_id')
      .notNull()
      .references(() => shelves.id, { onDelete: 'cascade' }),
    workId: uuid('work_id')
      .notNull()
      .references(() => bookWorks.id, { onDelete: 'cascade' }),
    editionId: uuid('edition_id').references(() => bookEditions.id, {
      onDelete: 'set null'
    }),
    notes: text('notes'),
    ...timestamps
  },
  (t) => [primaryKey({ columns: [t.shelfId, t.workId] })]
)

// Relations
export const shelvesRelations = relations(shelves, ({ many }) => ({
  items: many(shelfItems)
}))

export const shelfItemsRelations = relations(shelfItems, ({ one }) => ({
  shelf: one(shelves, {
    fields: [shelfItems.shelfId],
    references: [shelves.id]
  }),
  work: one(bookWorks, {
    fields: [shelfItems.workId],
    references: [bookWorks.id]
  }),
  edition: one(bookEditions, {
    fields: [shelfItems.editionId],
    references: [bookEditions.id]
  })
}))
