'use server'

import { db } from '@/db'
import { bookEditions } from '@/db/schema'
import { ratings, RatingValue } from '@/db/schema/ratings.schema'
import { isNone, isSome } from '@/lib/types'
import { and, avg, count, eq } from 'drizzle-orm'
import { getAuthenticatedUserId } from './actions.helpers'
import { auth } from '@clerk/nextjs/server'

/**
 * Get a user's rating for a book edition
 */
export async function getUserRating(bookEditionId: string) {
  const { userId } = await auth()
  if (isNone(userId)) return null
  return (
    (await db.query.ratings.findFirst({
      where: and(
        eq(ratings.editionId, bookEditionId),
        eq(ratings.userId, userId)
      )
    })) ?? null
  )
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
 * Rate a book with a specific rating value
 */
export async function upsertBookRating(
  bookEditionId: string,
  ratingValue: RatingValue
) {
  const userId = await getAuthenticatedUserId()

  const result = await db
    .insert(ratings)
    .values({
      editionId: bookEditionId,
      userId,
      rating: ratingValue
    })
    .onConflictDoUpdate({
      target: [ratings.userId, ratings.editionId],
      set: {
        rating: ratingValue
      }
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
export async function getBookEditionAverageRating(bookEditionId: string) {
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
  const [
    { averageRating, totalRatings } = { averageRating: 0, totalRatings: 0 }
  ] = await db
    .select({
      averageRating: avg(ratings.rating),
      totalRatings: count(ratings.id)
    })
    .from(ratings)
    .innerJoin(bookEditions, eq(ratings.editionId, bookEditions.id))
    .where(eq(bookEditions.workId, workId))
    .groupBy(bookEditions.workId)

  return {
    averageRating,
    totalRatings
  }
}

/**
 * Server actions to get ratings distribution for a book by id
 */
export async function getBookRatingsDistribution(workId: string) {
  const bookRatings = await db
    .select({
      rating: ratings.rating
    })
    .from(ratings)
    .innerJoin(bookEditions, eq(ratings.editionId, bookEditions.id))
    .where(eq(bookEditions.workId, workId))

  const distribution = bookRatings.reduce<Record<RatingValue, number>>(
    (acc, rating) => {
      acc[rating.rating] = acc[rating.rating] + 1
      return acc
    },
    {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    }
  )
  return distribution
}
