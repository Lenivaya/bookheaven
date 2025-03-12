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
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
  timestamps
} from './columns.helpers'

// Bookshelves table
export const shelves = pgTable(
  'shelves',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id').notNull(),
    name: text('name').notNull(), // Currently reading, to read, favorites, etc.
    description: text('description'),
    isPublic: boolean('is_public').notNull().default(false),
    likesCount: integer('likes_count').notNull().default(0),
    ...timestamps
  },
  (t) => [unique('user_shelf_unique').on(t.userId, t.name)]
)

// Track shelf likes
export const shelfLikes = pgTable('shelf_likes', {
  shelfId: uuid('shelf_id')
    .notNull()
    .references(() => shelves.id, {
      onDelete: 'cascade'
    }),
  userId: text('user_id').notNull(),
  ...timestamps
})

// Books in shelves - allows same book to be in multiple shelves
export const shelfItems = pgTable(
  'shelf_items',
  {
    shelfId: uuid('shelf_id')
      .notNull()
      .references(() => shelves.id, { onDelete: 'cascade' }),
    editionId: uuid('edition_id')
      .notNull()
      .references(() => bookEditions.id, { onDelete: 'cascade' }),
    notes: text('notes'),
    ...timestamps
  },
  (t) => [primaryKey({ columns: [t.shelfId, t.editionId] })]
)

// Relations
export const shelvesRelations = relations(shelves, ({ many }) => ({
  items: many(shelfItems),
  likes: many(shelfLikes)
}))

export const shelfItemsRelations = relations(shelfItems, ({ one }) => ({
  shelf: one(shelves, {
    fields: [shelfItems.shelfId],
    references: [shelves.id]
  }),
  bookEdition: one(bookEditions, {
    fields: [shelfItems.editionId],
    references: [bookEditions.id]
  })
}))

export type BookShelf = typeof shelves.$inferSelect
export type BookShelfItems = typeof shelfItems.$inferSelect

export const selectShelfSchema = createSelectSchema(shelves)
export const insertShelfSchema = createInsertSchema(shelves)
export const updateShelfSchema = createUpdateSchema(shelves)

export const insertShelfItemSchema = createInsertSchema(shelfItems)
