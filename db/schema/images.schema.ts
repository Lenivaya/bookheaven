import { pgTable, text, uuid } from 'drizzle-orm/pg-core'

import { timestamps } from './columns.helpers'
import { authors, bookEditions } from './books.schema'
import { relations } from 'drizzle-orm'

export const authorImages = pgTable('author_images', {
  id: uuid('id').defaultRandom().primaryKey(),
  url: text('url').notNull(),
  fileKey: text('file_key').notNull(),
  authorId: uuid('author_id')
    .notNull()
    .references(() => authors.id),
  ...timestamps
})

export const authorImagesRelations = relations(authorImages, ({ one }) => ({
  author: one(authors, {
    fields: [authorImages.authorId],
    references: [authors.id]
  })
}))

export const bookImages = pgTable('book_images', {
  id: uuid('id').defaultRandom().primaryKey(),
  url: text('url').notNull(),
  fileKey: text('file_key').notNull(),
  editionId: uuid('edition_id')
    .notNull()
    .references(() => bookEditions.id),
  ...timestamps
})

export const bookImagesRelations = relations(bookImages, ({ one }) => ({
  edition: one(bookEditions, {
    fields: [bookImages.editionId],
    references: [bookEditions.id]
  })
}))
