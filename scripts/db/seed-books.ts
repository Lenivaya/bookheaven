import chalk from 'chalk'
import 'dotenv/config'
import { faker } from '@faker-js/faker'
// import isbn from 'node-isbn'
import { db } from '@/db'
import { reviews } from '@/db/schema'
import {
  authors,
  bookEditions,
  bookWorks,
  tags,
  workToAuthors,
  workToTags
} from '@/db/schema/books.schema'
import { ratings } from '@/db/schema/ratings.schema'
import { Option } from '@/lib/types'
import { seed } from 'drizzle-seed'
import IsbnFetch from 'isbn-fetch'
import type { paths } from 'open-library-api'
import createClient from 'openapi-fetch'

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
  ],
  // Robert M. Sapolsky
  OL10273083A: [
    '9780525560975' // Determined: A Science of Life without Free Will
  ],
  // Ernest Hemingway
  OL13640A: [
    '9780684830490', // The Old Man and the Sea, by Ernest Hemingway
    '9780099910107', // A Farewell to Arms, by Ernest Hemingway
    '9780099908609', // For Whom the Bell Tolls, by Ernest Hemingway
    '9781416591313', // A Moveable Feast, by Ernest Hemingway
    '9780099908500' // The Sun Also Rises, by Ernest Hemingway
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

// Store book and author data for later use with drizzle-seed
const bookData: {
  workId: string
  editionId: string
  title: string
}[] = []

const main = async () => {
  // Clear existing data
  // await reset(db, { schema })
  await db.delete(bookEditions)
  await db.delete(bookWorks)
  await db.delete(authors)
  await db.delete(tags)
  await db.delete(ratings)
  await db.delete(reviews)
  await db.delete(workToAuthors)
  await db.delete(workToTags)

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

      const bookTitle = book.title || 'Unknown Title'

      // Insert work
      const [insertedWork] = await db
        .insert(bookWorks)
        .values({
          title: bookTitle,
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
      const [insertedEdition] = await db
        .insert(bookEditions)
        .values({
          workId: insertedWork.id,
          isbn: book.isbn13,
          publisher: book.publishers?.[0],
          publishedAt: parseDate(book.publishedDate),
          language: book.language?.toLowerCase() || 'en',
          pageCount: book.pageCount,
          thumbnailUrl: book.thumbnail,
          smallThumbnailUrl: book.thumbnailSmall,
          price: faker.commerce.price({ min: 9.99, max: 49.99, dec: 2 }),
          stockQuantity: faker.number.int({ min: 10, max: 200 })
        })
        .returning()

      // Store book data for later use with drizzle-seed
      bookData.push({
        workId: insertedWork.id,
        editionId: insertedEdition.id,
        title: bookTitle
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

      console.log(chalk.blue(`Processed book: ${bookTitle}`))
    }
  }

  // Now use drizzle-seed to generate ratings
  console.log(chalk.yellow('Generating ratings using drizzle-seed...'))

  // Generate 50 random user IDs to simulated some activity
  const userIds = Array.from(
    { length: bookData.length * 20 },
    (_, i) => `user_${i + 1}`
  )

  // Seed ratings using drizzle-seed
  await seed(db, { ratings }).refine((f) => ({
    ratings: {
      count: bookData.length * 20,
      columns: {
        editionId: f.valuesFromArray({
          values: bookData.map((book) => book.editionId)
        }),
        userId: f.valuesFromArray({ values: userIds, isUnique: true }),
        rating: f.weightedRandom([
          { weight: 0.4, value: f.default({ defaultValue: 5 }) },
          { weight: 0.3, value: f.default({ defaultValue: 4 }) },
          { weight: 0.15, value: f.default({ defaultValue: 3 }) },
          { weight: 0.1, value: f.default({ defaultValue: 2 }) },
          { weight: 0.05, value: f.default({ defaultValue: 1 }) }
        ]),
        deletedAt: f.default({ defaultValue: null })
      }
    }
  }))

  console.log(chalk.green('Ratings generated successfully'))
}

main()
  .catch(console.error)
  .then(() => {
    console.log(chalk.green('Seeding completed'))
    process.exit(0)
  })
