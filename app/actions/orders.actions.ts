'use server'

import { db } from '@/db'
import {
  authors,
  bookEditions,
  bookWorks,
  orderItems,
  orders,
  tags,
  workToAuthors,
  workToTags
} from '@/db/schema'
import {
  and,
  countDistinct,
  eq,
  getTableColumns,
  ilike,
  or,
  SQL
} from 'drizzle-orm'
import { getAuthenticatedUserId } from './actions.helpers'

export type FetchedOrderRelations = typeof orders.$inferSelect & {
  items: (typeof orderItems.$inferSelect & {
    bookEdition: typeof bookEditions.$inferSelect & {
      work: typeof bookWorks.$inferSelect
    }
  })[]
}

/**
 * Server action to fetch orders with multi-criteria search at the database level
 */
export async function getOrders(
  options: {
    limit: number
    offset: number
    search?: string
  } = {
    limit: 10,
    offset: 0,
    search: ''
  }
) {
  const user = await getAuthenticatedUserId()

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
  const getFilteredOrdersQuery = db
    .select({
      ...getTableColumns(orders)
    })
    .from(orders)
    .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
    .innerJoin(bookEditions, eq(orderItems.bookEditionId, bookEditions.id))
    .innerJoin(bookWorks, eq(bookEditions.workId, bookWorks.id))
    .leftJoin(workToAuthors, eq(bookWorks.id, workToAuthors.workId))
    .leftJoin(authors, eq(workToAuthors.authorId, authors.id))
    .leftJoin(workToTags, eq(bookWorks.id, workToTags.workId))
    .leftJoin(tags, eq(workToTags.tagId, tags.id))
    .where(and(...filters, eq(orders.userId, user)))
    .as('filteredOrders')

  const getFilteredOrders = db
    .selectDistinct({
      id: getFilteredOrdersQuery.id
    })
    .from(getFilteredOrdersQuery)
  const getTotalCount = db
    .select({
      totalCount: countDistinct(getFilteredOrdersQuery.id)
    })
    .from(getFilteredOrdersQuery)

  const getOrderFinal = db.query.orders.findMany({
    where: (orders, { inArray }) => inArray(orders.id, getFilteredOrders),
    limit: options.limit,
    offset: options.offset,
    with: {
      items: {
        with: {
          bookEdition: {
            with: {
              work: true
            }
          }
        }
      }
    }
  })

  const [finalOrders, [{ totalCount }]] = await Promise.all([
    getOrderFinal,
    getTotalCount
  ])

  return {
    orders: finalOrders as FetchedOrderRelations[],
    totalCount,
    pageCount: Math.ceil(Number(totalCount) / options.limit)
  }
}
