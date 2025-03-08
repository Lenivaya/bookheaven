import { db } from '@/db'
import { insertQuoteSchema, quoteLikes, quotes } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { getAuthenticatedUserId } from './actions.helpers'
import { isSome } from '@/lib/types'

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
  const userId = await getAuthenticatedUserId()
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
  return db.insert(quoteLikes).values({ quoteId, userId }).onConflictDoNothing()
}

/** Delete a quote like */
export async function deleteQuoteLike(quoteId: string) {
  const userId = await getAuthenticatedUserId()
  return db
    .delete(quoteLikes)
    .where(and(eq(quoteLikes.quoteId, quoteId), eq(quoteLikes.userId, userId)))
}

/** Toggle a quote like */
export async function toggleQuoteLike(quoteId: string) {
  if (await hasLikedQuote(quoteId)) {
    await deleteQuoteLike(quoteId)
  } else {
    await upsertQuoteLike(quoteId)
  }
}
