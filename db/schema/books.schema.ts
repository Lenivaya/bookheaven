import {
  pgTable,
  text,
  uuid,
  integer,
  timestamp,
  primaryKey,
  boolean,
  decimal,
  index,
  uniqueIndex
} from 'drizzle-orm/pg-core'
import { createInsertSchema, timestamps } from './columns.helpers'
import { relations, sql } from 'drizzle-orm'
import { ratings } from './ratings.schema'
import { authorFollowers } from './followers.schema'
import { createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { reviews } from './reviews.schema'
import { orderItems } from './orders.schema'

// Authors table
export const authors = pgTable(
  'authors',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull().unique(),
    biography: text('biography'),
    birthDate: timestamp('birth_date'),
    deathDate: timestamp('death_date'),
    photoUrl: text('photo_url'),
    ...timestamps
  },
  (table) => [
    index('authors_name_idx').on(table.name),
    index('authors_name_search_idx').on(table.name)
  ]
)

// BookWorks table - represents the intellectual property of a book
export const bookWorks = pgTable(
  'book_works',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    originalTitle: text('original_title'), // In case of translations
    description: text('description'),
    writingCompletedAt: timestamp('writing_completed_at'),
    originalLanguage: text('original_language').default('en'),
    ...timestamps
  },
  (table) => [
    index('book_works_title_idx').on(table.title),
    index('book_works_original_title_idx').on(table.originalTitle),
    index('book_works_description_idx').on(table.description),
    index('book_works_title_search_idx').on(table.title),
    index('book_works_description_search_idx').on(table.description),
    index('book_works_content_search_idx').on(table.title, table.description)
  ]
)

// BookEditions table - represents specific published editions
export const bookEditions = pgTable(
  'book_editions',
  {
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
    isOnSale: boolean('is_on_sale').notNull().default(false),
    salePrice: decimal('sale_price', { precision: 10, scale: 2 }),
    stockQuantity: integer('stock_quantity').notNull().default(0),
    thumbnailUrl: text('thumbnail_url'),
    smallThumbnailUrl: text('small_thumbnail_url'),
    likesCount: integer('likes_count').default(0),
    ...timestamps
  },
  (table) => [
    index('book_editions_work_id_idx').on(table.workId),
    uniqueIndex('book_editions_isbn_idx').on(table.isbn),
    index('book_editions_publisher_idx').on(table.publisher),
    index('book_editions_edition_idx').on(table.edition),
    index('book_editions_format_idx').on(table.format),
    index('book_editions_is_on_sale_idx').on(table.isOnSale),
    index('book_editions_publisher_search_idx').on(table.publisher),
    index('book_editions_edition_search_idx').on(table.edition)
  ]
)

export const bookLikes = pgTable(
  'book_likes',
  {
    userId: text('user_id').notNull(),
    editionId: uuid('edition_id')
      .notNull()
      .references(() => bookEditions.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.editionId] }),
    index('book_likes_edition_id_idx').on(t.editionId),
    index('book_likes_user_id_idx').on(t.userId)
  ]
)

// Tags/Genres table
export const tags = pgTable(
  'tags',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull().unique(),
    description: text('description'),
    coverUrl: text('cover_url'),
    ...timestamps
  },
  (table) => [
    index('tags_name_idx').on(table.name),
    index('tags_name_search_idx').on(table.name)
  ]
)

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
  (t) => [
    primaryKey({ columns: [t.workId, t.authorId] }),
    index('work_to_authors_work_id_idx').on(t.workId),
    index('work_to_authors_author_id_idx').on(t.authorId)
  ]
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
  (t) => [
    primaryKey({ columns: [t.workId, t.tagId] }),
    index('work_to_tags_work_id_idx').on(t.workId),
    index('work_to_tags_tag_id_idx').on(t.tagId)
  ]
)

// Relations
export const bookWorksRelations = relations(bookWorks, ({ many }) => ({
  editions: many(bookEditions),
  workToAuthors: many(workToAuthors),
  workToTags: many(workToTags)
}))

export const bookEditionsRelations = relations(
  bookEditions,
  ({ one, many }) => ({
    work: one(bookWorks, {
      fields: [bookEditions.workId],
      references: [bookWorks.id]
    }),
    likes: many(bookLikes),
    orders: many(orderItems)
  })
)

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

export const bookWorksRatingRelations = relations(bookWorks, ({ many }) => ({
  ratings: many(ratings),
  reviews: many(reviews)
}))

export const bookEditionsRatingRelations = relations(
  bookEditions,
  ({ many }) => ({
    ratings: many(ratings)
  })
)

export const authorsFollowersRelations = relations(authors, ({ many }) => ({
  followers: many(authorFollowers)
}))

export type Author = typeof authors.$inferSelect
export type BookWork = typeof bookWorks.$inferSelect
export type BookEdition = typeof bookEditions.$inferSelect
export type Tag = typeof tags.$inferSelect
export type WorkToAuthor = typeof workToAuthors.$inferSelect
export type WorkToTag = typeof workToTags.$inferSelect

export const authorsSelectSchema = createSelectSchema(authors)
export const bookWorksSelectSchema = createSelectSchema(bookWorks)
export const bookEditionsSelectSchema = createSelectSchema(bookEditions)
export const tagsSelectSchema = createSelectSchema(tags)
export const booksTagsRelationsSelectSchema = createSelectSchema(workToTags)

export const bookEditionsInsertSchema = createInsertSchema(bookEditions)
export const bookWorksInsertSchema = createInsertSchema(bookWorks)
export const authorsInsertSchema = createInsertSchema(authors)
export const tagsInsertSchema = createInsertSchema(tags)

export const bookEditionsUpdateSchema = createUpdateSchema(bookEditions)
export const bookWorksUpdateSchema = createUpdateSchema(bookWorks)
export const authorsUpdateSchema = createUpdateSchema(authors)
export const tagsUpdateSchema = createUpdateSchema(tags)
