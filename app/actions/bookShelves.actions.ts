'use server'

import { db } from '@/db'
import {
  authors,
  BookEdition,
  bookEditions,
  BookShelf,
  BookShelfItems,
  BookWork,
  bookWorks,
  insertShelfItemSchema,
  insertShelfSchema,
  shelfItems,
  shelfLikes,
  shelves,
  tags,
  updateShelfSchema,
  WorkToAuthor,
  WorkToTag,
  workToAuthors,
  workToTags,
  Author,
  Tag
} from '@/db/schema'
import { DefaultShelves } from '@/lib/constants'
import { isNone, isSome } from '@/lib/types'
import {
  and,
  countDistinct,
  eq,
  getTableColumns,
  ilike,
  inArray,
  or,
  SQL,
  sql
} from 'drizzle-orm'
import { z } from 'zod'
import { getAuthenticatedUserId } from './actions.helpers'
import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'

export type FetchedShelfRelations = typeof shelves.$inferSelect & {
  items: (typeof shelfItems.$inferSelect & {
    bookEdition: typeof bookEditions.$inferSelect & {
      work: typeof bookWorks.$inferSelect & {
        workToAuthors: typeof workToAuthors.$inferSelect &
          {
            author: typeof authors.$inferSelect
          }[]
        workToTags: typeof workToTags.$inferSelect &
          {
            tag: typeof tags.$inferSelect
          }[]
      }
    }
  })[]
}

/**
 * Server action to fetch book shelves with multi-criteria search at the database level
 */
export async function getBookShelves(
  options: {
    limit: number
    offset: number
    search?: string
    userIds?: string[]
    tagsIds?: string[]
    authorsIds?: string[]
    bookWorksIds?: string[]
    onlyPublic?: boolean
    likedByUser?: boolean
  } = {
    limit: 10,
    offset: 0,
    search: '',
    userIds: [],
    tagsIds: [],
    authorsIds: [],
    onlyPublic: false,
    likedByUser: false
  }
) {
  const filters: SQL[] = []

  if (isSome(options.userIds) && options.userIds.length > 0) {
    filters.push(inArray(shelves.userId, options.userIds))
  }

  if (isSome(options.tagsIds) && options.tagsIds.length > 0) {
    filters.push(inArray(tags.id, options.tagsIds))
  }

  if (isSome(options.authorsIds) && options.authorsIds.length > 0) {
    filters.push(inArray(authors.id, options.authorsIds))
  }

  if (isSome(options.bookWorksIds) && options.bookWorksIds.length > 0) {
    filters.push(inArray(bookEditions.workId, options.bookWorksIds))
  }

  if (options.onlyPublic) {
    filters.push(eq(shelves.isPublic, true))
  }

  if (options.likedByUser) {
    const { userId } = await auth()
    if (isSome(userId)) {
      const likedShelves = db
        .select({
          shelfId: shelfLikes.shelfId
        })
        .from(shelfLikes)
        .where(eq(shelfLikes.userId, userId))
      filters.push(inArray(shelves.id, likedShelves))
    }
  }

  if (options.search) {
    const searchTerms = options.search.trim().split(/\s+/).filter(Boolean)
    const orConditions: SQL[] = searchTerms.map((term) =>
      or(
        ilike(shelves.name, `%${term}%`),
        ilike(shelves.description, `%${term}%`),
        ilike(bookWorks.title, `%${term}%`),
        ilike(bookWorks.originalTitle, `%${term}%`),
        ilike(bookWorks.description, `%${term}%`),
        ilike(bookEditions.publisher, `%${term}%`),
        ilike(bookEditions.edition, `%${term}%`),
        ilike(tags.name, `%${term}%`),
        ilike(authors.name, `%${term}%`)
      )
    ) as SQL[]
    filters.push(...orConditions)
  }

  const filteredShelvesQuery = db
    .select({
      ...getTableColumns(shelves)
    })
    .from(shelves)
    .innerJoin(shelfItems, eq(shelves.id, shelfItems.shelfId))
    .innerJoin(bookEditions, eq(shelfItems.editionId, bookEditions.id))
    .innerJoin(bookWorks, eq(bookEditions.workId, bookWorks.id))
    .leftJoin(workToAuthors, eq(bookWorks.id, workToAuthors.workId))
    .leftJoin(authors, eq(workToAuthors.authorId, authors.id))
    .leftJoin(workToTags, eq(bookWorks.id, workToTags.workId))
    .leftJoin(tags, eq(workToTags.tagId, tags.id))
    .where(and(...filters))
    .as('filteredShelves')

  const getFilteredShelves = db
    .selectDistinct({
      id: filteredShelvesQuery.id
    })
    .from(filteredShelvesQuery)

  const getTotalCount = db
    .select({
      totalCount: countDistinct(filteredShelvesQuery.id)
    })
    .from(filteredShelvesQuery)

  const getShelvesFinal = db.query.shelves.findMany({
    where: inArray(shelves.id, getFilteredShelves),
    limit: options.limit,
    offset: options.offset,
    orderBy: (shelves, { desc }) => [
      desc(shelves.updated_at),
      desc(shelves.created_at)
    ],
    with: {
      items: {
        with: {
          bookEdition: {
            with: {
              work: {
                with: {
                  workToAuthors: {
                    with: {
                      author: true
                    }
                  },
                  workToTags: {
                    with: {
                      tag: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })

  const [finalShelves, [{ totalCount }]] = await Promise.all([
    getShelvesFinal,
    getTotalCount
  ])

  return {
    shelves: finalShelves as FetchedShelfRelations[],
    totalCount,
    pageCount: Math.ceil(Number(totalCount) / options.limit)
  }
}

/**
 * Ensure the authenticated user is the author of the shelf
 */
export async function ensureShelfAuthor(shelfId: string) {
  const userId = await getAuthenticatedUserId()
  const shelf = await db.query.shelves.findFirst({
    where: and(eq(shelves.id, shelfId), eq(shelves.userId, userId))
  })
  if (isNone(shelf)) {
    throw new Error('Shelf not found')
  }
  return shelf
}

/**
 * Get all shelves for a user
 */
export async function getShelves() {
  const { userId } = await auth()
  if (isNone(userId)) return []
  return db.query.shelves.findMany({
    where: eq(shelves.userId, userId)
  })
}

/**
 * Gets a shelf by id
 */
export async function getShelfByIdMinimal(id: string) {
  const userId = await getAuthenticatedUserId()
  return await db.query.shelves.findFirst({
    where: and(
      eq(shelves.id, id),
      // Show only if shelf is public or the authenticated user is the owner
      or(
        eq(shelves.isPublic, true),
        isSome(userId) ? eq(shelves.userId, userId) : undefined
      )
    ),
    with: {
      items: true
    }
  })
}

/**
 * Gets a shelf by id with books
 */
export async function getShelfByIdWithBooks(id: string) {
  const { userId } = await auth()
  return (await db.query.shelves.findFirst({
    where: and(
      eq(shelves.id, id),
      // Show only if shelf is public or the authenticated user is the owner
      or(
        eq(shelves.isPublic, true),
        isSome(userId) ? eq(shelves.userId, userId) : undefined
      )
    ),
    with: {
      items: {
        with: {
          bookEdition: {
            with: {
              work: {
                with: {
                  workToAuthors: {
                    with: {
                      author: true
                    }
                  },
                  workToTags: {
                    with: {
                      tag: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })) as BookShelf & {
    items: (BookShelfItems & {
      bookEdition: BookEdition & {
        work: BookWork & {
          workToAuthors: (WorkToAuthor & {
            author: Author
          })[]
          workToTags: (WorkToTag & {
            tag: Tag
          })[]
        }
      }
    })[]
  }
}

const createShelfSchema = insertShelfSchema.omit({ userId: true })
/**
 * Create a shelf for the user
 */
export async function upsertShelf(
  shelfData: z.infer<typeof createShelfSchema>,
  items?: z.infer<typeof insertShelfItemSchema>[]
) {
  const userId = await getAuthenticatedUserId()
  await db.transaction(async (tx) => {
    const upsert = tx
      .insert(shelves)
      .values({
        ...shelfData,
        userId
      })
      .onConflictDoUpdate({
        target: [shelves.userId, shelves.name],
        set: {
          ...shelfData
        }
      })
    if (isSome(items)) {
      const [shelf] = await upsert.returning()
      const itemsWithShelfId = items.map((item) => ({
        ...item,
        shelfId: shelf.id
      }))
      await tx.insert(shelfItems).values(itemsWithShelfId)
    }
    await upsert
  })
}

/**
 * Update a shelf
 */
export async function updateShelf(
  shelfId: string,
  shelfData: z.infer<typeof updateShelfSchema>,
  items: z.infer<typeof insertShelfItemSchema>[]
) {
  const userId = await getAuthenticatedUserId()
  await db.transaction(async (tx) => {
    await tx
      .update(shelves)
      .set(shelfData)
      .where(and(eq(shelves.id, shelfId), eq(shelves.userId, userId)))

    // Recreating is faster
    await tx.delete(shelfItems).where(eq(shelfItems.shelfId, shelfId))
    await tx.insert(shelfItems).values(items)
  })
}

/**
 * Delete a shelf
 */
export async function deleteShelf(id: string) {
  const userId = await getAuthenticatedUserId()
  await db
    .delete(shelves)
    .where(and(eq(shelves.id, id), eq(shelves.userId, userId)))
}

/**
 * Add an item to a shelf
 */
export async function upsertShelfItem(
  itemData: z.infer<typeof insertShelfItemSchema>
) {
  return db
    .insert(shelfItems)
    .values(itemData)
    .onConflictDoUpdate({
      target: [shelfItems.shelfId, shelfItems.editionId],
      set: {
        ...itemData
      }
    })
    .returning()
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const upsertShelfItemWithShelfSchema = insertShelfItemSchema.omit({
  shelfId: true
})
/**
 * Upserts item to a shelf, also upserts the shelf if it doesn't exist
 */
export async function upsertShelfItemWithShelfName(
  itemData: z.infer<typeof upsertShelfItemWithShelfSchema>,
  shelfName: string
) {
  const userId = await getAuthenticatedUserId()
  const shelfExisting = await db.query.shelves.findFirst({
    where: and(eq(shelves.userId, userId), eq(shelves.name, shelfName))
  })

  if (isNone(shelfExisting)) {
    await upsertShelf(createShelfSchema.parse({ name: shelfName, userId }))
    const shelfExisting = await db.query.shelves.findFirst({
      where: and(eq(shelves.userId, userId), eq(shelves.name, shelfName))
    })
    if (isNone(shelfExisting)) {
      throw new Error('Shelf was not created')
    }
    return upsertShelfItem({ ...itemData, shelfId: shelfExisting.id })
  }

  return upsertShelfItem({ ...itemData, shelfId: shelfExisting.id })
}

/**
 * Checks if shelf has the book in it given shelf name and user id
 */
export async function hasBookInShelf(shelfName: string, editionId: string) {
  const { userId } = await auth()
  if (isNone(userId)) return false
  const shelf = await db.query.shelves.findFirst({
    where: and(eq(shelves.userId, userId), eq(shelves.name, shelfName)),
    with: {
      items: {
        where: eq(shelfItems.editionId, editionId)
      }
    }
  })
  return isSome(shelf)
}

/**
 * Delete an item from a shelf
 */
export async function deleteShelfItem(shelfId: string, editionId: string) {
  await ensureShelfAuthor(shelfId)
  const result = await db
    .delete(shelfItems)
    .where(
      and(eq(shelfItems.shelfId, shelfId), eq(shelfItems.editionId, editionId))
    )
    .returning()

  return result.length > 0
}

/**
 * Gets user like for a book shelve
 */
export async function getUserShelfLike(shelfId: string) {
  const { userId } = await auth()
  if (isNone(userId)) return null
  return db.query.shelfLikes.findFirst({
    where: and(eq(shelfLikes.shelfId, shelfId), eq(shelfLikes.userId, userId))
  })
}

/**
 * Checks if a user has liked a shelf
 */
export async function hasLikedShelf(shelfId: string) {
  return isSome(await getUserShelfLike(shelfId))
}

/**
 * Upserts a user like for a shelf
 */
export async function upsertShelfLike(shelfId: string) {
  const userId = await getAuthenticatedUserId()
  await db.transaction(async (tx) => {
    await tx
      .insert(shelfLikes)
      .values({ shelfId, userId })
      .onConflictDoNothing()
    await tx
      .update(shelves)
      .set({ likesCount: sql`${shelves.likesCount} + 1` })
      .where(eq(shelves.id, shelfId))
  })
}

/**
 * Deletes a user like for a shelf
 */
export async function deleteShelfLike(shelfId: string) {
  const userId = await getAuthenticatedUserId()
  await db.transaction(async (tx) => {
    await tx
      .delete(shelfLikes)
      .where(
        and(eq(shelfLikes.shelfId, shelfId), eq(shelfLikes.userId, userId))
      )
    await tx
      .update(shelves)
      .set({ likesCount: sql`${shelves.likesCount} - 1` })
      .where(eq(shelves.id, shelfId))
  })
}

/**
 * Toggle a shelf like (if exists, delete it; if doesn't exist, create with rating value)
 */
export async function toggleShelfLike(shelfId: string) {
  if (await hasLikedShelf(shelfId)) {
    await deleteShelfLike(shelfId)
  } else {
    await upsertShelfLike(shelfId)
  }
  revalidatePath('/book-shelves')
  revalidatePath(`/book-shelves/${shelfId}`)
}

/**
 * Get user shelves with their items for efficient client-side filtering
 * Returns shelves with their items so the client can check if a book is in a shelf
 */
export async function getUserShelvesWithItems(shelfNames?: DefaultShelves[]) {
  const { userId } = await auth()
  if (isNone(userId)) return []

  // Get all shelves with the given names and their items
  const userShelves = await db.query.shelves.findMany({
    where: shelfNames
      ? and(eq(shelves.userId, userId), inArray(shelves.name, shelfNames))
      : eq(shelves.userId, userId),
    with: {
      items: true
    },
    columns: {
      id: true,
      name: true
    }
  })

  return userShelves
}
