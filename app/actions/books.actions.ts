'use server'

import { db } from '@/db'
import {
  Author,
  authors,
  BookEdition,
  bookEditions,
  bookLikes,
  BookWork,
  bookWorks,
  Tag,
  tags,
  WorkToAuthor,
  workToAuthors,
  WorkToTag,
  workToTags
} from '@/db/schema'
import { isNone, isSome, Option } from '@/lib/types'
import {
  and,
  countDistinct,
  eq,
  getTableColumns,
  ilike,
  inArray,
  or,
  sql,
  SQL
} from 'drizzle-orm'
import { getAuthenticatedUserId } from './actions.helpers'

type Book = {
  edition: BookEdition
  work: BookWork
  authors: Author[]
  tags: Tag[]
}

type FetchedBookRelations = BookEdition & {
  work: BookWork & {
    workToAuthors: WorkToAuthor &
      {
        author: Author
      }[]
    workToTags: WorkToTag &
      {
        tag: Tag
      }[]
  }
}

/**
 * Server action to fetch books with multi-criteria search at the database level
 */
export async function getBooks(
  options: {
    limit: number
    offset: number
    search?: string
    tagsIds?: string[]
    authorsIds?: string[]
    bookWorksIds?: string[]
    bookEditionsIds?: string[]
  } = {
    limit: 10,
    offset: 0,
    search: '',
    tagsIds: [],
    authorsIds: [],
    bookWorksIds: [],
    bookEditionsIds: []
  }
): Promise<{ books: Book[]; totalCount: number; pageCount: number }> {
  const filters: SQL[] = []

  if (options.search) {
    const searchTerms = options.search.trim().split(/\s+/).filter(Boolean)
    const orConditions: SQL[] = searchTerms.map((term) =>
      or(
        ilike(bookWorks.title, `%${term}%`),
        ilike(bookWorks.originalTitle, `%${term}%`),
        ilike(bookWorks.description, `%${term}%`),
        ilike(bookEditions.publisher, `%${term}%`),
        ilike(bookEditions.edition, `%${term}%`),
        ilike(tags.name, `%${term}%`),
        ilike(authors.name, `%${term}%`)
      )
    ) as SQL[]
    filters.push(...orConditions)
  }

  if (isSome(options.tagsIds) && options.tagsIds.length > 0) {
    filters.push(inArray(tags.id, options.tagsIds))
  }

  if (isSome(options.authorsIds) && options.authorsIds.length > 0) {
    filters.push(inArray(authors.id, options.authorsIds))
  }

  if (isSome(options.bookWorksIds) && options.bookWorksIds.length > 0) {
    filters.push(inArray(bookWorks.id, options.bookWorksIds))
  }

  if (isSome(options.bookEditionsIds) && options.bookEditionsIds.length > 0) {
    filters.push(inArray(bookEditions.id, options.bookEditionsIds))
  }

  const filterebBooksQuery = db
    .select({
      ...getTableColumns(bookEditions)
    })
    .from(bookEditions)
    .innerJoin(bookWorks, eq(bookEditions.workId, bookWorks.id))
    .leftJoin(workToAuthors, eq(bookWorks.id, workToAuthors.workId))
    .leftJoin(authors, eq(workToAuthors.authorId, authors.id))
    .leftJoin(workToTags, eq(bookWorks.id, workToTags.workId))
    .leftJoin(tags, eq(workToTags.tagId, tags.id))
    .where(and(...filters))
    .as('filteredBooks')

  const getFilteredBooks = db
    .selectDistinct({
      id: filterebBooksQuery.id
    })
    .from(filterebBooksQuery)
  const getTotalCount = db
    .select({
      totalCount: countDistinct(filterebBooksQuery.id)
    })
    .from(filterebBooksQuery)

  const getBookFinal = db.query.bookEditions.findMany({
    where: (bookEditions, { inArray }) =>
      inArray(bookEditions.id, getFilteredBooks),
    limit: options.limit,
    offset: options.offset,
    with: {
      work: {
        with: {
          workToAuthors: {
            with: {
              author: true
            }
          },
          workToTags: {
            with: {
              tag: true
            }
          }
        }
      }
    }
  })

  const [books, [{ totalCount }]] = await Promise.all([
    getBookFinal,
    getTotalCount
  ])

  return {
    // books: [],
    books: (books as FetchedBookRelations[]).map((book) => ({
      edition: book,
      work: book.work!,
      authors: book.work.workToAuthors.map(({ author }) => author),
      tags: book.work.workToTags.map(({ tag }) => tag)
    })),
    totalCount,
    pageCount: Math.ceil(Number(totalCount) / options.limit)
  }
}

/**
 * Server action to fetch a single book by ID
 */
export async function getBookById(id: string): Promise<Option<Book>> {
  const book = (await db.query.bookEditions.findFirst({
    where: eq(bookEditions.id, id),
    with: {
      work: {
        with: {
          workToAuthors: {
            with: {
              author: true
            }
          },
          workToTags: {
            with: {
              tag: true
            }
          }
        }
      }
    }
  })) as Option<
    BookEdition & {
      work: BookWork & {
        workToAuthors: WorkToAuthor &
          {
            author: Author
          }[]
        workToTags: WorkToTag &
          {
            tag: Tag
          }[]
      }
    }
  >

  if (isNone(book)) {
    return null
  }

  return {
    edition: book,
    work: book.work!,
    authors: book.work.workToAuthors.map(({ author }) => author),
    tags: book.work.workToTags.map(({ tag }) => tag)
  }
}

/**
 * Server action to fetch book work by id
 **/
export async function getBookWorkById(id: string) {
  return await db.query.bookWorks.findFirst({
    where: eq(bookWorks.id, id)
  })
}

/**
 * Server action to check if a user has liked a book by id
 */
export async function hasLikedBook(bookEditionId: string) {
  const userId = await getAuthenticatedUserId()
  const result = await db.query.bookLikes.findFirst({
    where: and(
      eq(bookLikes.editionId, bookEditionId),
      eq(bookLikes.userId, userId)
    )
  })
  return isSome(result)
}

/**
 * Server action to toggle a book like by id
 */
export async function toggleBookLike(bookEditionId: string) {
  if (await hasLikedBook(bookEditionId)) {
    await unlikeBook(bookEditionId)
  } else {
    await upserBookLike(bookEditionId)
  }
}

/**
 * Server action to like a book by id
 */
export async function upserBookLike(bookEditionId: string) {
  const userId = await getAuthenticatedUserId()
  await db.transaction(async (tx) => {
    await tx
      .insert(bookLikes)
      .values({
        editionId: bookEditionId,
        userId: userId
      })
      .onConflictDoNothing()
    await tx
      .update(bookEditions)
      .set({
        likesCount: sql`${bookEditions.likesCount} + 1`
      })
      .where(eq(bookEditions.id, bookEditionId))
  })
}

/**
 * Server action to unlike a book by id
 */
export async function unlikeBook(bookEditionId: string) {
  const userId = await getAuthenticatedUserId()
  await db.transaction(async (tx) => {
    await tx
      .delete(bookLikes)
      .where(
        and(
          eq(bookLikes.editionId, bookEditionId),
          eq(bookLikes.userId, userId)
        )
      )
    await tx
      .update(bookEditions)
      .set({
        likesCount: sql`${bookEditions.likesCount} - 1`
      })
      .where(eq(bookEditions.id, bookEditionId))
  })
}

/**
 * Server action to fetch a single book with all its relations
 */
export async function getBook(id: string) {
  const book = (await db.query.bookEditions.findFirst({
    where: eq(bookEditions.id, id),
    with: {
      work: {
        with: {
          workToAuthors: {
            with: {
              author: true
            }
          },
          workToTags: {
            with: {
              tag: true
            }
          }
        }
      }
    }
  })) as Option<FetchedBookRelations>

  if (isNone(book)) {
    return null
  }

  return {
    edition: book,
    work: book.work!,
    authors: book.work.workToAuthors.map(({ author }) => author),
    tags: book.work.workToTags.map(({ tag }) => tag)
  }
}

/**
 * Server action to create or update a book (work + edition)
 */
export async function upsertBook(
  data: {
    // BookWork fields
    title: string
    originalTitle?: string | null
    description?: string | null
    writingCompletedAt?: Date | null
    originalLanguage: string

    // BookEdition fields
    isbn: string
    publisher: string
    publishedAt?: Date | null
    language: string
    pageCount?: number | null
    format: string
    edition: string
    price?: number | null
    thumbnailUrl?: string | null

    // Relations
    authorIds: string[]
    tagIds: string[]
  },
  bookEditionId?: string
) {
  return await db.transaction(async (tx) => {
    // If we're updating, get the existing book work ID
    let workId: string | undefined
    if (bookEditionId) {
      const existingEdition = await tx.query.bookEditions.findFirst({
        where: eq(bookEditions.id, bookEditionId),
        columns: {
          workId: true
        }
      })
      workId = existingEdition?.workId
    }

    // Create or update the book work
    const [work] = await tx
      .insert(bookWorks)
      .values({
        id: workId,
        title: data.title,
        originalTitle: data.originalTitle,
        description: data.description,
        writingCompletedAt: data.writingCompletedAt,
        originalLanguage: data.originalLanguage
      })
      .onConflictDoUpdate({
        target: bookWorks.id,
        set: {
          title: data.title,
          originalTitle: data.originalTitle,
          description: data.description,
          writingCompletedAt: data.writingCompletedAt,
          originalLanguage: data.originalLanguage
        }
      })
      .returning()

    // Create or update the book edition
    const [edition] = await tx
      .insert(bookEditions)
      .values({
        id: bookEditionId,
        workId: work.id,
        isbn: data.isbn,
        publisher: data.publisher,
        publishedAt: data.publishedAt,
        language: data.language,
        pageCount: data.pageCount,
        format: data.format,
        edition: data.edition,
        price: String(data.price),
        thumbnailUrl: data.thumbnailUrl
      })
      .onConflictDoUpdate({
        target: bookEditions.id,
        set: {
          isbn: data.isbn,
          publisher: data.publisher,
          publishedAt: data.publishedAt,
          language: data.language,
          pageCount: data.pageCount,
          format: data.format,
          edition: data.edition,
          price: String(data.price),
          thumbnailUrl: data.thumbnailUrl
        }
      })
      .returning()

    // Update author relations
    if (workId) {
      await tx.delete(workToAuthors).where(eq(workToAuthors.workId, work.id))
    }
    await tx.insert(workToAuthors).values(
      data.authorIds.map((authorId) => ({
        workId: work.id,
        authorId
      }))
    )

    // Update tag relations
    if (workId) {
      await tx.delete(workToTags).where(eq(workToTags.workId, work.id))
    }
    if (data.tagIds.length > 0) {
      await tx.insert(workToTags).values(
        data.tagIds.map((tagId) => ({
          workId: work.id,
          tagId
        }))
      )
    }

    return { work, edition }
  })
}

/**
 * Server action to delete a book by edition ID
 */
export async function deleteBook(editionId: string) {
  try {
    // Get the book work ID first
    const edition = await db.query.bookEditions.findFirst({
      where: eq(bookEditions.id, editionId),
      columns: {
        workId: true
      }
    })

    if (!edition) {
      return { success: false, error: 'Book not found' }
    }

    await db.transaction(async (tx) => {
      // Delete the edition first
      await tx.delete(bookEditions).where(eq(bookEditions.id, editionId))

      // Check if this was the last edition for this work
      const remainingEditions = await tx.query.bookEditions.findMany({
        where: eq(bookEditions.workId, edition.workId),
        columns: {
          id: true
        }
      })

      // If no more editions exist, delete the work and its relations
      if (remainingEditions.length === 0) {
        await tx
          .delete(workToAuthors)
          .where(eq(workToAuthors.workId, edition.workId))
        await tx.delete(workToTags).where(eq(workToTags.workId, edition.workId))
        await tx.delete(bookWorks).where(eq(bookWorks.id, edition.workId))
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting book:', error)
    return { success: false, error: 'Failed to delete book' }
  }
}
