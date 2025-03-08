import { db } from '@/db'
import {
  insertShelfItemSchema,
  insertShelfSchema,
  shelfItems,
  shelfLikes,
  shelves
} from '@/db/schema'
import { and, eq, or } from 'drizzle-orm'
import { getAuthenticatedUserId } from './actions.helpers'
import { auth } from '@clerk/nextjs/server'
import { isNone, isSome } from '@/lib/types'
import { z } from 'zod'

export type DefaultShelves =
  | 'Want to Read'
  | 'Currently Reading'
  | 'Read'
  | 'Did Not Finish'

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

export const createShelfSchema = insertShelfSchema.omit({ userId: true })
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

/**
 * Delete an item from a shelf
 */
export async function deleteShelfItem(shelfId: string, workId: string) {
  await ensureShelfAuthor(shelfId)
  return db
    .delete(shelfItems)
    .where(and(eq(shelfItems.shelfId, shelfId), eq(shelfItems.workId, workId)))
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
