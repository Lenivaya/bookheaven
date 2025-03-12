import { createSearchParamsCache, parseAsString } from 'nuqs/server'

export const authorSearchParamsSchema = {
  page: parseAsString.withDefault('1'),
  q: parseAsString.withDefault('')
}

export const authorSearchParamsCache = createSearchParamsCache(
  authorSearchParamsSchema
)
