import 'dotenv/config'
import chalk from 'chalk'
// import isbn from 'node-isbn'
import IsbnFetch from 'isbn-fetch'
import createClient from 'openapi-fetch'
import type { paths } from 'open-library-api'
import { db } from '@/db'
import {
  authors,
  bookEditions,
  bookWorks,
  tags,
  workToAuthors,
  workToTags
} from '@/db/schema/books.schema'
import { Option } from '@/lib/types'

const openLibraryClient = createClient<paths>({
  baseUrl: 'https://openlibrary.org/'
})

// authors -> books
const booksToSeed: Record<string, string[]> = {
  // Louis-Ferdinand Céline
  OL2781391A: [
    '9780811216548', // Journey to the end of the night, by Louis-Ferdinand Céline
    '9780811200172', // Death on the Installment Plan, by Louis-Ferdinand Céline
    '9781564781505', // Castle to Castle, by Louis-Ferdinand Céline
    '9780811200189', // Guignol's Band, by Louis-Ferdinand Céline
    '9781564781420' // North, by Louis-Ferdinand Céline
  ],
  // Kurt Vonnegut
  OL20187A: [
    '9780440180296', // Slaughterhouse-Five, by Kurt Vonnegut
    '9780385334143', // Mother Night, by Kurt Vonnegut
    '9780385333481', // Cat's Cradle, by Kurt Vonnegut
    '9780385334204', // Breakfast of Champions, by Kurt Vonnegut
    '9780385333498' // The Sirens of Titan, by Kurt Vonnegut
  ],
  // Fyodor Dostoevsky
  OL22242A: [
    '9780679420293', // Crime and Punishment, by Fyodor Dostoevsky
    '9780374528379', // The Brothers Karamazov, by Fyodor Dostoevsky
    '9780679642428' // The Idiot, by Fyodor Dostoevsky
  ],
  // Algernon Blackwood
  OL394726A: [
    '9781587156526' // The Willows, by Algernon Blackwood
  ],
  // Albert Camus
  OL124171A: [
    '9782070360024', // L'étranger, by Albert Camus
    '9780593318669', // The Plague, by Albert Camus
    '9780679720225', // The Fall, by Albert Camus
    '9780141182001' // The Myth of Sisyphus, by Albert Camus
  ],
  // Vladimir Sorokin
  OL5765986A: [
    '9780374134754', // Day of the Oprichnik, by Vladimir Sorokin
    '9785933810049' // Roman, by Vladimir Sorokin
  ]
}

// https://covers.openlibrary.org/a/$key/$value-$size.jpg
// size can be one of S, M and L for small, medium and large respectively.
//
// For example the following is the photograph of Donald E. Knuth from the Open Library.
// https://covers.openlibrary.org/a/olid/OL229501A-S.jpg
const getAuthorPhotoUrl = (authorId: string, size: 'S' | 'M' | 'L' = 'S') => {
  return `https://covers.openlibrary.org/a/olid/${authorId}-${size}.jpg`
}

const fetchBook = async (isbn: string) => {
  const info = await IsbnFetch.combined(isbn)
  return info
}

const fetchAuthor = async (id: string) => {
  const author = await openLibraryClient.GET('/authors/{id}.json', {
    params: {
      path: { id }
    }
  })
  return author
}

const parseDate = (dateStr: string | undefined) => {
  if (!dateStr) return null
  return new Date(dateStr)
}

const getText = (field: Option<{ type: string; value: string }>) => {
  if (!field) return null
  if (typeof field === 'string') return field
  return field.value
}

const main = async () => {
  // Clear existing data
  await db.delete(workToTags)
  await db.delete(workToAuthors)
  await db.delete(bookEditions)
  await db.delete(bookWorks)
  await db.delete(authors)
  await db.delete(tags)

  for (const [authorId, books] of Object.entries(booksToSeed)) {
    const authorResponse = await fetchAuthor(authorId)
    const authorData = authorResponse.data

    if (!authorData) {
      console.error(chalk.red(`Failed to fetch author ${authorId}`))
      continue
    }

    console.log(chalk.green(`Processing ${authorData.name}`))

    // Insert author
    const [insertedAuthor] = await db
      .insert(authors)
      .values({
        name: authorData.name || 'Unknown Author',
        biography: getText(authorData.bio),
        birthDate: parseDate(authorData.birth_date),
        deathDate: parseDate(authorData.death_date),
        photoUrl: authorData.photos?.[0]
          ? getAuthorPhotoUrl(authorId, 'L')
          : null
      })
      .returning()

    // Fetch and process books
    const authorBooks = await Promise.all(books.map(fetchBook))

    for (const book of authorBooks) {
      if (!book) continue

      // Insert work
      const [insertedWork] = await db
        .insert(bookWorks)
        .values({
          title: book.title || 'Unknown Title',
          description: book.description,
          originalLanguage: book.language?.toLowerCase() || 'en'
        })
        .returning()

      // Link author to work
      await db.insert(workToAuthors).values({
        authorId: insertedAuthor.id,
        workId: insertedWork.id
      })

      // Insert edition
      await db.insert(bookEditions).values({
        workId: insertedWork.id,
        isbn: book.isbn13,
        publisher: book.publishers?.[0],
        publishedAt: parseDate(book.publishedDate),
        language: book.language?.toLowerCase() || 'en',
        pageCount: book.pageCount,
        thumbnailUrl: book.thumbnail,
        smallThumbnailUrl: book.thumbnailSmall,
        price: '9.99',
        stockQuantity: 100
      })

      // Insert genres as tags and link them to work
      if (book.genres) {
        for (const genre of book.genres) {
          const [tag] = await db
            .insert(tags)
            .values({ name: genre })
            .onConflictDoUpdate({
              target: tags.name,
              set: { name: genre }
            })
            .returning()

          await db.insert(workToTags).values({
            tagId: tag.id,
            workId: insertedWork.id
          })
        }
      }

      console.log(chalk.blue(`Processed book: ${book.title}`))
    }
  }
}

main()
  .catch(console.error)
  .then(() => {
    console.log(chalk.green('Seeding completed'))
    process.exit(0)
  })
