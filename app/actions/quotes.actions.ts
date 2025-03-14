import { db } from '@/db'
import { insertQuoteSchema, quoteLikes, quotes } from '@/db/schema'
import { and, eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { getAuthenticatedUserId } from './actions.helpers'
import { isNone, isSome } from '@/lib/types'
import { auth } from '@clerk/nextjs/server'

/**
 * Get a quote by id
 */
export async function getQuoteById(id: string) {
  return db.query.quotes.findFirst({
    where: eq(quotes.id, id)
  })
}

export const createQuoteSchema = insertQuoteSchema.omit({ userId: true })
/**
 * Upserts a quote
 */
export async function upsertQuote(quote: z.infer<typeof createQuoteSchema>) {
  const userId = await getAuthenticatedUserId()
  return db
    .insert(quotes)
    .values({ ...quote, userId })
    .onConflictDoNothing()
}

/**
 * Delete a quote
 */
export async function deleteQuote(id: string) {
  return db.delete(quotes).where(eq(quotes.id, id))
}

/** Get quote like for specific quote */
export async function getQuoteLike(quoteId: string) {
  const { userId } = await auth()
  if (isNone(userId)) return null
  return db.query.quoteLikes.findFirst({
    where: and(eq(quoteLikes.quoteId, quoteId), eq(quoteLikes.userId, userId))
  })
}

/** Check if user has liked a quote */
export async function hasLikedQuote(quoteId: string) {
  return isSome(await getQuoteLike(quoteId))
}

/** Upsert a quote like */
export async function upsertQuoteLike(quoteId: string) {
  const userId = await getAuthenticatedUserId()
  await db.transaction(async (tx) => {
    await tx
      .insert(quoteLikes)
      .values({ quoteId, userId })
      .onConflictDoNothing()
    await tx
      .update(quotes)
      .set({ likesCount: sql`${quotes.likesCount} + 1` })
      .where(eq(quotes.id, quoteId))
  })
}

/** Delete a quote like */
export async function deleteQuoteLike(quoteId: string) {
  const userId = await getAuthenticatedUserId()
  await db.transaction(async (tx) => {
    await tx
      .delete(quoteLikes)
      .where(
        and(eq(quoteLikes.quoteId, quoteId), eq(quoteLikes.userId, userId))
      )
    await tx
      .update(quotes)
      .set({ likesCount: sql`${quotes.likesCount} - 1` })
      .where(eq(quotes.id, quoteId))
  })
}

/** Toggle a quote like */
export async function toggleQuoteLike(quoteId: string) {
  if (await hasLikedQuote(quoteId)) {
    await deleteQuoteLike(quoteId)
  } else {
    await upsertQuoteLike(quoteId)
  }
}
