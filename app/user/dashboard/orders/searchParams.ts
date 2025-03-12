import { createSearchParamsCache, parseAsString } from 'nuqs/server'

export const orderSearchParamsSchema = {
  page: parseAsString.withDefault('1'),
  q: parseAsString.withDefault('')
}

export const orderSearchParamsCache = createSearchParamsCache(
  orderSearchParamsSchema
)
