'use server'

import { getAuthenticatedUserId } from '@/app/actions/actions.helpers'
import { db } from '@/db'
import { bookEditions, bookLikes } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getUserLikedBooks() {
  const user = await getAuthenticatedUserId()
  const likedBooks = await db
    .select({
      bookId: bookEditions.id
    })
    .from(bookLikes)
    .innerJoin(bookEditions, eq(bookLikes.editionId, bookEditions.id))
    .where(eq(bookLikes.userId, user))

  return likedBooks.map((book) => book.bookId)
}
