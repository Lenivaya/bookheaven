'use server'

import { db } from '@/db'
import { tags } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Server action to fetch tag by id
 **/
export async function getTag(id: string) {
  try {
    const tag = await db.query.tags.findFirst({
      where: eq(tags.id, id)
    })
    return tag
  } catch (error) {
    console.error(`Error fetching tag with ID ${id}:`, error)
    throw new Error('Failed to fetch tag')
  }
}
