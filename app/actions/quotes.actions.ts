import { db } from '@/db'
import { quotes } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Get a quote by id
 */
export async function getQuoteById(id: string) {
  return db.query.quotes.findFirst({
    where: eq(quotes.id, id)
  })
}
