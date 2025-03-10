'use server'

import { db } from '@/db'
import { ratings, reviewCreateSchema, reviewLikes, reviews } from '@/db/schema'
import { isSome } from '@/lib/types'
import { and, eq, getTableColumns, sql } from 'drizzle-orm'
import { z } from 'zod'
import { getAuthenticatedUserId } from './actions.helpers'
import { revalidatePath } from 'next/cache'

/**
 * Get reviews for a book edition
 */
export async function getReviews(
  bookEditionId: string,
  options: {
    limit: number
    offset: number
  } = {
    limit: 10,
    offset: 0
  }
) {
  const result = db
    .select({
      review: getTableColumns(reviews),
      rating: getTableColumns(ratings)
    })
    .from(reviews)
    .leftJoin(ratings, eq(reviews.editionId, ratings.editionId))
    .where(eq(reviews.editionId, bookEditionId))
    .limit(options.limit)
    .offset(options.offset)

  return result
}

/**
 * Has reviewed this book edition
 */
export async function hasReviewedBookEdition(editionId: string) {
  const userId = await getAuthenticatedUserId()
  return isSome(
    await db.query.reviews.findFirst({
      where: (reviews, { eq, and }) =>
        and(eq(reviews.editionId, editionId), eq(reviews.userId, userId))
    })
  )
}

/**
 * Upsert a review
 */
export async function upsertReview(
  review: Omit<z.infer<typeof reviewCreateSchema>, 'userId'>
) {
  const values = reviewCreateSchema.parse({
    ...review,
    userId: await getAuthenticatedUserId()
  })
  await db
    .insert(reviews)
    .values(values)
    .onConflictDoUpdate({
      target: [reviews.id],
      set: {
        ...values
      }
    })

  // Revalidate the book detail page to show the new review
  revalidatePath(`/books/${review.editionId}`)
}

/**
 * Delete a review
 */
export async function deleteReview(reviewId: string) {
  const userId = await getAuthenticatedUserId()
  const [review] = await db
    .delete(reviews)
    .where(and(eq(reviews.id, reviewId), eq(reviews.userId, userId)))
    .returning()

  if (review) {
    revalidatePath(`/books/${review.editionId}`)
  }
}

/**
 * Get a review by id
 */
export async function getReviewById(reviewId: string) {
  return db.query.reviews.findFirst({
    where: (reviews, { eq }) => eq(reviews.id, reviewId)
  })
}

/**
 * Check if a user has liked a review
 */
export async function hasLikedReview(reviewId: string) {
  const userId = await getAuthenticatedUserId()
  return isSome(
    await db.query.reviewLikes.findFirst({
      where: (reviewLikes, { eq, and }) =>
        and(eq(reviewLikes.reviewId, reviewId), eq(reviewLikes.userId, userId))
    })
  )
}

/**
 * Toggle a review like
 */
export async function toggleReviewLike(reviewId: string) {
  if (await hasLikedReview(reviewId)) {
    await unlikeReview(reviewId)
  } else {
    await upserBookLike(reviewId)
  }

  // Get the review to find its editionId for revalidation
  const review = await getReviewById(reviewId)
  if (review) {
    revalidatePath(`/books/${review.editionId}`)
  }
}

/**
 * Like a review
 */
export async function upserBookLike(reviewId: string) {
  const userId = await getAuthenticatedUserId()
  await db.transaction(async (tx) => {
    await tx
      .insert(reviewLikes)
      .values({
        reviewId,
        userId
      })
      .onConflictDoNothing()
    await tx
      .update(reviews)
      .set({
        likesCount: sql`${reviews.likesCount} + 1`
      })
      .where(eq(reviews.id, reviewId))
  })
}

/**
 * Unlike a review
 */
export async function unlikeReview(reviewId: string) {
  const userId = await getAuthenticatedUserId()
  await db.transaction(async (tx) => {
    await tx
      .delete(reviewLikes)
      .where(
        and(eq(reviewLikes.reviewId, reviewId), eq(reviewLikes.userId, userId))
      )
    await tx
      .update(reviews)
      .set({
        likesCount: sql`${reviews.likesCount} - 1`
      })
      .where(eq(reviews.id, reviewId))
  })
}
