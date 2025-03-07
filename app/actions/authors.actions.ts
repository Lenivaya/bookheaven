'use server'

import { db } from '@/db'
import { authors } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Server action to fetch author by id
 **/
export async function getAuthor(id: string) {
  try {
    const author = await db.query.authors.findFirst({
      where: eq(authors.id, id)
    })
    return author
  } catch (error) {
    console.error(`Error fetching author with ID ${id}:`, error)
    throw new Error('Failed to fetch author')
  }
}
