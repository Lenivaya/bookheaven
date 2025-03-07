'use server'

import { db } from '@/db'
import {
  Author,
  authors,
  BookEdition,
  bookEditions,
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
import { and, eq, ilike, inArray, or, SQL } from 'drizzle-orm'

type Book = {
  edition: BookEdition
  work: BookWork
  authors: Author[]
  tags: Tag[]
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
  } = {
    limit: 10,
    offset: 0,
    search: '',
    tagsIds: [],
    authorsIds: [],
    bookWorksIds: []
  }
) {
  try {
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
          ilike(tags.name, `%${term}%`)
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

    const books = await db
      .select()
      .from(bookEditions)
      .innerJoin(bookWorks, eq(bookEditions.workId, bookWorks.id))
      .leftJoin(workToAuthors, eq(bookWorks.id, workToAuthors.workId))
      .leftJoin(authors, eq(workToAuthors.authorId, authors.id))
      .leftJoin(workToTags, eq(bookWorks.id, workToTags.workId))
      .leftJoin(tags, eq(workToTags.tagId, tags.id))
      .where(and(...filters))
      .limit(options.limit)
      .offset(options.offset)

    const result = books.reduce<Record<string, Book>>((acc, row) => {
      const { book_editions, book_works, authors, tags } = row
      if (!acc[book_works.id]) {
        acc[book_works.id] = {
          edition: book_editions,
          work: book_works,
          authors: [],
          tags: []
        }
      }
      if (authors) {
        if (!acc[book_works.id].authors.some((a) => a.id === authors.id)) {
          acc[book_works.id].authors.push(authors)
        }
      }
      if (tags) {
        if (!acc[book_works.id].tags.some((t) => t.id === tags.id)) {
          acc[book_works.id].tags.push(tags)
        }
      }
      return acc
    }, {})

    return Object.values(result)
  } catch (error) {
    console.error('Error fetching books:', error)
    throw new Error('Failed to fetch books')
  }
}

/**
 * Server action to fetch a single book by ID
 */
export async function getBookById(id: string): Promise<Option<Book>> {
  try {
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
  } catch (error) {
    console.error(`Error fetching book with ID ${id}:`, error)
    throw new Error('Failed to fetch book')
  }
}

/**
 * Server action to fetch book work by id
 **/
export async function getBookWorkById(id: string) {
  try {
    return await db.query.bookWorks.findFirst({
      where: eq(bookWorks.id, id)
    })
  } catch (error) {
    console.error(`Error fetching book work with ID ${id}:`, error)
    throw new Error('Failed to fetch book work')
  }
}
