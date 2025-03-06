import { relations } from 'drizzle-orm'
import { pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core'
import { authors } from './books.schema'
import { timestamps } from './columns.helpers'

// User following other users
export const userFollowers = pgTable(
  'user_followers',
  {
    followerId: text('follower_id').notNull(),
    followingId: text('following_id').notNull(),
    ...timestamps
  },
  (t) => [primaryKey({ columns: [t.followerId, t.followingId] })]
)

// User following authors
export const authorFollowers = pgTable(
  'author_followers',
  {
    userId: text('user_id').notNull(),
    authorId: uuid('author_id')
      .notNull()
      .references(() => authors.id, { onDelete: 'cascade' }),
    ...timestamps
  },
  (t) => [primaryKey({ columns: [t.userId, t.authorId] })]
)

// Relations
export const authorFollowersRelations = relations(
  authorFollowers,
  ({ one }) => ({
    author: one(authors, {
      fields: [authorFollowers.authorId],
      references: [authors.id]
    })
  })
)
