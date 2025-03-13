'use server'

import { db } from '@/db'
import {
  authorFollowers,
  authors,
  bookEditions,
  bookWorks,
  shelfItems,
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
  SQL,
  sum
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
    .select({
      totalCount: countDistinct(authors.id)
    })
    .from(authors)
    .innerJoin(workToAuthors, eq(authors.id, workToAuthors.authorId))
    .innerJoin(bookWorks, eq(workToAuthors.workId, bookWorks.id))
    .innerJoin(workToTags, eq(bookWorks.id, workToTags.workId))
    .innerJoin(tags, eq(workToTags.tagId, tags.id))
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

/**
 * Get author books count
 */
export async function getAuthorStats(authorId: string) {
  const [{ bookCount } = { bookCount: 0 }] = await db
    .select({
      bookCount: countDistinct(bookWorks.id)
    })
    .from(bookWorks)
    .innerJoin(workToAuthors, eq(bookWorks.id, workToAuthors.workId))
    .where(eq(workToAuthors.authorId, authorId))

  const [{ likesCount } = { likesCount: 0 }] = await db
    .select({
      likesCount: sum(bookEditions.likesCount)
    })
    .from(bookEditions)
    .innerJoin(bookWorks, eq(bookEditions.workId, bookWorks.id))
    .innerJoin(workToAuthors, eq(bookWorks.id, workToAuthors.workId))
    .where(eq(workToAuthors.authorId, authorId))

  const [{ followersCount } = { followersCount: 0 }] = await db
    .select({
      followersCount: countDistinct(authorFollowers.authorId)
    })
    .from(authorFollowers)
    .where(eq(authorFollowers.authorId, authorId))

  const [{ mentionedInShelvesCount } = { mentionedInShelvesCount: 0 }] =
    await db
      .select({
        mentionedInShelvesCount: countDistinct(shelfItems.shelfId)
      })
      .from(shelfItems)
      .innerJoin(bookEditions, eq(shelfItems.editionId, bookEditions.id))
      .innerJoin(bookWorks, eq(bookEditions.workId, bookWorks.id))
      .innerJoin(workToAuthors, eq(bookWorks.id, workToAuthors.workId))
      .where(eq(workToAuthors.authorId, authorId))

  return {
    bookCount,
    likesCount,
    followersCount,
    mentionedInShelvesCount
  }
}
