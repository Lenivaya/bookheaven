import {
  createSearchParamsCache,
  parseAsString,
  parseAsArrayOf
} from 'nuqs/server'

export const bookSearchParamsSchema = {
  page: parseAsString.withDefault('1'),
  q: parseAsString.withDefault(''),
  tags: parseAsArrayOf(parseAsString).withDefault([]),
  authors: parseAsArrayOf(parseAsString).withDefault([]),
  books: parseAsArrayOf(parseAsString).withDefault([])
}

export const bookSearchParamsCache = createSearchParamsCache(
  bookSearchParamsSchema
)
