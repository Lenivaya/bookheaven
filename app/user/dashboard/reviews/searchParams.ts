import {
  createSearchParamsCache,
  parseAsString,
  parseAsArrayOf
} from 'nuqs/server'

export const reviewSearchParamsSchema = {
  page: parseAsString.withDefault('1'),
  q: parseAsString.withDefault(''),
  userIds: parseAsArrayOf(parseAsString).withDefault([])
}

export const reviewSearchParamsCache = createSearchParamsCache(
  reviewSearchParamsSchema
)
