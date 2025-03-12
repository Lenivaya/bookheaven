import {
  createSearchParamsCache,
  parseAsString,
  parseAsArrayOf
} from 'nuqs/server'

export const bookShelvesSearchParamsSchema = {
  page: parseAsString.withDefault('1'),
  q: parseAsString.withDefault(''),
  tags: parseAsArrayOf(parseAsString).withDefault([]),
  authors: parseAsArrayOf(parseAsString).withDefault([]),
  books: parseAsArrayOf(parseAsString).withDefault([])
}

export const bookShelvesSearchParamsCache = createSearchParamsCache(
  bookShelvesSearchParamsSchema
)
