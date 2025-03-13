'use server'

import { db } from '@/db'
import { authors } from '@/db/schema/books.schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function deleteAuthor(authorId: string) {
  try {
    await db.delete(authors).where(eq(authors.id, authorId))
    revalidatePath('/authors')
    revalidatePath('/admin/authors')
    return { success: true }
  } catch (error) {
    console.error('Error deleting author:', error)
    return { success: false, error: 'Failed to delete author' }
  }
}
