'use server'

import { db } from '@/db'
import { bookEditions } from '@/db/schema'
import { ratings } from '@/db/schema/ratings.schema'
import { mergeManyIfs } from '@/lib/objects'
import { isNone, isSome } from '@/lib/types'
import { and, avg, count, eq } from 'drizzle-orm'
import { getAuthenticatedUserId } from './actions.helpers'

export type RatingValue = 1 | 2 | 3 | 4 | 5

/**
 * Get a user's rating for a book edition
 */
export async function getUserRating(bookEditionId: string) {
  const userId = await getAuthenticatedUserId()
  return db.query.ratings.findFirst({
    where: and(eq(ratings.editionId, bookEditionId), eq(ratings.userId, userId))
  })
}

/**
 * Check if a user has rated a book edition
 */
export async function hasRatedBook(bookEditionId: string) {
  return isSome(await getUserRating(bookEditionId))
}

/**
 * Toggle a book rating (if exists, delete it; if doesn't exist, create with rating value)
 */
export async function toggleBookRating(
  bookEditionId: string,
  ratingValue: RatingValue
) {
  if (await hasRatedBook(bookEditionId)) {
    await deleteBookRating(bookEditionId)
  } else {
    await upsertBookRating(bookEditionId, ratingValue)
  }
}

/**
 * Get work ID from book edition ID
 */
async function getWorkIdFromEdition(bookEditionId: string) {
  const edition = await db.query.bookEditions.findFirst({
    where: eq(bookEditions.id, bookEditionId),
    columns: {
      workId: true
    }
  })

  if (!edition) {
    throw new Error(`Book edition with ID ${bookEditionId} not found`)
  }

  return edition.workId
}

/**
 * Rate a book with a specific rating value
 */
export async function upsertBookRating(
  bookEditionId: string,
  ratingValue: RatingValue,
  review?: string
) {
  console.log('upsertBookRating', bookEditionId, ratingValue, review)
  const userId = await getAuthenticatedUserId()
  const workId = await getWorkIdFromEdition(bookEditionId)

  const result = await db
    .insert(ratings)
    .values({
      editionId: bookEditionId,
      workId,
      userId,
      rating: ratingValue,
      review
    })
    .onConflictDoUpdate({
      target: [ratings.userId, ratings.workId, ratings.editionId],
      set: mergeManyIfs(
        {
          rating: ratingValue
        },
        [[isSome(review), { review }]]
      )
    })
    .returning()

  return result.length > 0
}

/**
 * Delete a book rating
 */
export async function deleteBookRating(bookEditionId: string) {
  const userId = await getAuthenticatedUserId()

  const result = await db
    .delete(ratings)
    .where(
      and(eq(ratings.editionId, bookEditionId), eq(ratings.userId, userId))
    )
    .returning()

  return result.length > 0
}

/**
 * Get average rating for a book edition
 */
export async function getBookAverageRating(bookEditionId: string) {
  const [result] = await db
    .select({
      averageRating: avg(ratings.rating),
      totalRatings: count(ratings.id)
    })
    .from(ratings)
    .where(eq(ratings.editionId, bookEditionId))
    .groupBy(ratings.editionId)

  if (isNone(result)) {
    return { averageRating: 0, totalRatings: 0 }
  }

  return {
    averageRating: Number(result.averageRating) || 0,
    totalRatings: Number(result.totalRatings) || 0
  }
}

/**
 * Get average rating for a book work (across all editions)
 */
export async function getWorkAverageRating(workId: string) {
  const [result] = await db
    .select({
      averageRating: avg(ratings.rating),
      totalRatings: count(ratings.id)
    })
    .from(ratings)
    .where(eq(ratings.workId, workId))
    .groupBy(ratings.workId)

  if (isNone(result)) {
    return { averageRating: 0, totalRatings: 0 }
  }

  return {
    averageRating: Number(result.averageRating) || 0,
    totalRatings: Number(result.totalRatings) || 0
  }
}
