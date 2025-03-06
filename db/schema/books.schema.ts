import {
  pgTable,
  text,
  uuid,
  integer,
  timestamp,
  primaryKey,
  boolean,
  decimal
} from 'drizzle-orm/pg-core'
import { timestamps } from './columns.helpers'
import { relations } from 'drizzle-orm'

// Authors table
export const authors = pgTable('authors', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  biography: text('biography'),
  birthDate: timestamp('birth_date'),
  ...timestamps
})

// BookWorks table - represents the intellectual property of a book
export const bookWorks = pgTable('book_works', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  originalTitle: text('original_title'), // In case of translations
  description: text('description'),
  writingCompletedAt: timestamp('writing_completed_at'),
  originalLanguage: text('original_language').default('en'),
  ...timestamps
})

// BookEditions table - represents specific published editions
export const bookEditions = pgTable('book_editions', {
  id: uuid('id').defaultRandom().primaryKey(),
  workId: uuid('work_id')
    .notNull()
    .references(() => bookWorks.id),
  isbn: text('isbn').unique(),
  publisher: text('publisher'),
  publishedAt: timestamp('published_at'),
  language: text('language').default('en'),
  pageCount: integer('page_count'),
  format: text('format'), // hardcover, paperback, ebook, etc.
  edition: text('edition'), // "First Edition", "Second Revised Edition", etc.
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  isOnSale: boolean('is_on_sale').default(false),
  salePrice: decimal('sale_price', { precision: 10, scale: 2 }),
  stockQuantity: integer('stock_quantity').notNull().default(0),
  ...timestamps
})

// Tags/Genres table
export const tags = pgTable('tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  ...timestamps
})

// Many-to-many relationship between works and authors
export const workToAuthors = pgTable(
  'work_to_authors',
  {
    workId: uuid('work_id')
      .notNull()
      .references(() => bookWorks.id, { onDelete: 'cascade' }),
    authorId: uuid('author_id')
      .notNull()
      .references(() => authors.id, { onDelete: 'cascade' })
  },
  (t) => [primaryKey({ columns: [t.workId, t.authorId] })]
)

// Many-to-many relationship between works and tags
export const workToTags = pgTable(
  'work_to_tags',
  {
    workId: uuid('work_id')
      .notNull()
      .references(() => bookWorks.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' })
  },
  (t) => [primaryKey({ columns: [t.workId, t.tagId] })]
)

// Relations
export const bookWorksRelations = relations(bookWorks, ({ many }) => ({
  editions: many(bookEditions),
  workToAuthors: many(workToAuthors),
  workToTags: many(workToTags)
}))

export const bookEditionsRelations = relations(bookEditions, ({ one }) => ({
  work: one(bookWorks, {
    fields: [bookEditions.workId],
    references: [bookWorks.id]
  })
}))

export const authorsRelations = relations(authors, ({ many }) => ({
  workToAuthors: many(workToAuthors)
}))

export const workToAuthorsRelations = relations(workToAuthors, ({ one }) => ({
  work: one(bookWorks, {
    fields: [workToAuthors.workId],
    references: [bookWorks.id]
  }),
  author: one(authors, {
    fields: [workToAuthors.authorId],
    references: [authors.id]
  })
}))

export const workToTagsRelations = relations(workToTags, ({ one }) => ({
  work: one(bookWorks, {
    fields: [workToTags.workId],
    references: [bookWorks.id]
  }),
  tag: one(tags, {
    fields: [workToTags.tagId],
    references: [tags.id]
  })
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  workToTags: many(workToTags)
}))
