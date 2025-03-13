import { pgTable, text, uuid } from 'drizzle-orm/pg-core'

import { timestamps } from './columns.helpers'
import { authors } from './books.schema'
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
