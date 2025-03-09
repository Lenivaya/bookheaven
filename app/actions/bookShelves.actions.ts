'use server'

import { db } from '@/db'
import {
  insertShelfItemSchema,
  insertShelfSchema,
  shelfItems,
  shelfLikes,
  shelves
} from '@/db/schema'
import { isNone, isSome } from '@/lib/types'
import { auth } from '@clerk/nextjs/server'
import { and, eq, inArray, or } from 'drizzle-orm'
import { z } from 'zod'
import { getAuthenticatedUserId } from './actions.helpers'
import { DefaultShelves } from '@/lib/constants'

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
  const userId = await getAuthenticatedUserId()
  return db.query.shelves.findMany({
    where: eq(shelves.userId, userId)
  })
}

/**
 * Gets a shelf by id
 */
export async function getShelfById(id: string) {
  const { userId } = await auth()
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

const createShelfSchema = insertShelfSchema.omit({ userId: true })
/**
 * Create a shelf for the user
 */
export async function upsertShelf(
  shelfData: z.infer<typeof createShelfSchema>
) {
  const userId = await getAuthenticatedUserId()
  return db
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
}

/**
 * Delete a shelf
 */
export async function deleteShelf(id: string) {
  const userId = await getAuthenticatedUserId()
  return db
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
      target: [shelfItems.shelfId, shelfItems.workId],
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
export async function hasBookInShelf(shelfName: string, workId: string) {
  const userId = await getAuthenticatedUserId()
  const shelf = await db.query.shelves.findFirst({
    where: and(eq(shelves.userId, userId), eq(shelves.name, shelfName)),
    with: {
      items: {
        where: eq(shelfItems.workId, workId)
      }
    }
  })
  return isSome(shelf)
}

/**
 * Delete an item from a shelf
 */
export async function deleteShelfItem(shelfId: string, workId: string) {
  await ensureShelfAuthor(shelfId)
  const result = await db
    .delete(shelfItems)
    .where(and(eq(shelfItems.shelfId, shelfId), eq(shelfItems.workId, workId)))
    .returning()

  return result.length > 0
}

/**
 * Gets user like for a book shelve
 */
export async function getUserShelfLike(shelfId: string) {
  const userId = await getAuthenticatedUserId()
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
  return db.insert(shelfLikes).values({ shelfId, userId }).onConflictDoNothing()
}

/**
 * Deletes a user like for a shelf
 */
export async function deleteShelfLike(shelfId: string) {
  const userId = await getAuthenticatedUserId()
  return db
    .delete(shelfLikes)
    .where(and(eq(shelfLikes.shelfId, shelfId), eq(shelfLikes.userId, userId)))
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
}

/**
 * Get user shelves with their items for efficient client-side filtering
 * Returns shelves with their items so the client can check if a book is in a shelf
 */
export async function getUserShelvesWithItems(shelfNames?: DefaultShelves[]) {
  const userId = await getAuthenticatedUserId()

  // Get all shelves with the given names and their items
  const userShelves = await db.query.shelves.findMany({
    where: shelfNames
      ? and(eq(shelves.userId, userId), inArray(shelves.name, shelfNames))
      : eq(shelves.userId, userId),
    with: {
      items: {
        columns: {
          workId: true
        }
      }
    },
    columns: {
      id: true,
      name: true
    }
  })

  return userShelves
}
