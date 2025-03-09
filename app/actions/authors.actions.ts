'use server'

import { db } from '@/db'
import {
  authors,
  bookWorks,
  tags,
  workToAuthors,
  workToTags
} from '@/db/schema'
import {
  and,
  countDistinct,
  eq,
  getTableColumns,
  ilike,
  or,
  SQL
} from 'drizzle-orm'

/**
 * Server action to fetch authors with multi-criteria search at the database level
 */
export async function getAuthors(
  options: {
    limit: number
    offset: number
    search?: string
  } = {
    limit: 10,
    offset: 0,
    search: ''
  }
) {
  const filters: SQL[] = []

  if (options.search) {
    const searchTerms = options.search.trim().split(/\s+/).filter(Boolean)
    const orConditions: SQL[] = searchTerms.map((term) =>
      or(
        ilike(authors.name, `%${term}%`),
        ilike(authors.biography, `%${term}%`),
        ilike(bookWorks.title, `%${term}%`),
        ilike(bookWorks.originalTitle, `%${term}%`),
        ilike(bookWorks.description, `%${term}%`),
        ilike(tags.name, `%${term}%`)
      )
    ) as SQL[]
    filters.push(...orConditions)
  }

  const getAuthors = db
    .selectDistinctOn([authors.id], {
      ...getTableColumns(authors)
    })
    .from(authors)
    .innerJoin(workToAuthors, eq(authors.id, workToAuthors.authorId))
    .innerJoin(bookWorks, eq(workToAuthors.workId, bookWorks.id))
    .innerJoin(workToTags, eq(bookWorks.id, workToTags.workId))
    .innerJoin(tags, eq(workToTags.tagId, tags.id))
    .where(and(...filters))
    .limit(options.limit)
    .offset(options.offset)
  const getTotalCount = db
    .selectDistinctOn([authors.id], {
      totalCount: countDistinct(authors.id)
    })
    .from(authors)
    .innerJoin(workToAuthors, eq(authors.id, workToAuthors.authorId))
    .innerJoin(bookWorks, eq(workToAuthors.workId, bookWorks.id))
    .where(and(...filters))

  const [resultAuthors, [{ totalCount }]] = await Promise.all([
    getAuthors,
    getTotalCount
  ])

  return { authors: resultAuthors, totalCount }
}

/**
 * Server action to fetch author by id
 **/
export async function getAuthor(id: string) {
  const author = await db.query.authors.findFirst({
    where: eq(authors.id, id)
  })
  return author ?? null
}
