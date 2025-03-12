'use server'

import { db } from '@/db'
import { tags, workToTags } from '@/db/schema'
import { desc, eq, sql } from 'drizzle-orm'

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

/**
 * Fetch popular tags with unique cover images
 */
export async function getPopularTags(
  options: { limit: number } = { limit: 10 }
) {
  const getTagsWithCounts = await db
    .select({
      id: tags.id,
      count: sql<number>`count(${tags.id})`
    })
    .from(workToTags)
    .innerJoin(tags, eq(workToTags.tagId, tags.id))
    .groupBy(tags.id)
    .orderBy(desc(sql<number>`count(${tags.id})`))
  return db.query.tags.findMany({
    // where: inArray(tags.id, getTagsWithCounts.map((tag) => tag.id))
    limit: options.limit,
    where: (tags, { inArray, and, isNotNull }) =>
      and(
        inArray(
          tags.id,
          getTagsWithCounts.map((tag) => tag.id)
        ),
        isNotNull(tags.coverUrl)
      )
  })
}
