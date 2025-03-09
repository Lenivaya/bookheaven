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
import { ratings } from '@/db/schema/ratings.schema'
import { Option } from '@/lib/types'
import { seed } from 'drizzle-seed'

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

// Store book and author data for later use with drizzle-seed
const bookData: {
  workId: string
  editionId: string
  title: string
}[] = []

const main = async () => {
  // Clear existing data
  await db.delete(workToTags)
  await db.delete(workToAuthors)
  await db.delete(bookEditions)
  await db.delete(bookWorks)
  await db.delete(authors)
  await db.delete(tags)
  await db.delete(ratings)

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
          price: '9.99',
          stockQuantity: 100
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

  // Generate 50 random user IDs
  const userIds = Array.from({ length: 50 }, (_, i) => `user_${i + 1}`)

  // Create positive review templates
  const positiveReviews = [
    'I really enjoyed this book. Highly recommended!',
    "This was a fantastic read. Couldn't put it down.",
    "One of the best books I've read this year.",
    "The author's writing style is exceptional.",
    'A masterpiece that will stand the test of time.'
  ]

  // Create neutral review templates
  const neutralReviews = [
    'This book was decent, but not exceptional.',
    'An interesting read, though it dragged in some parts.',
    'Had some good moments, but also some flaws.',
    "Worth reading, but don't expect to be blown away.",
    "A solid book, but not the author's best work."
  ]

  // Create negative review templates
  const negativeReviews = [
    'I struggled to finish this book.',
    'Not what I expected. Disappointing overall.',
    'The plot was confusing and the characters underdeveloped.',
    "I wouldn't recommend this to others.",
    'Had potential but failed to deliver.'
  ]

  // Seed ratings using drizzle-seed
  await seed(db, { ratings }).refine((f) => ({
    ratings: {
      count: bookData.length * 10, // Average 10 ratings per book
      columns: {
        workId: f.valuesFromArray({
          values: bookData.map((book) => book.workId)
        }),
        editionId: f.weightedRandom([
          {
            weight: 0.7,
            value: f.valuesFromArray({
              values: bookData.map((book) => book.editionId)
            })
          },
          { weight: 0.3, value: f.default({ defaultValue: null }) }
        ]),
        userId: f.valuesFromArray({ values: userIds }),
        rating: f.int({ minValue: 1, maxValue: 5 }),
        review: f.weightedRandom([
          {
            weight: 0.3,
            value: f.default({ defaultValue: null })
          },
          {
            weight: 0.3,
            value: f.valuesFromArray({ values: positiveReviews })
          },
          {
            weight: 0.2,
            value: f.valuesFromArray({ values: neutralReviews })
          },
          {
            weight: 0.2,
            value: f.valuesFromArray({ values: negativeReviews })
          }
        ])
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
