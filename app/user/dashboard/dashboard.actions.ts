'use server'

import { getAuthenticatedUserId } from '@/app/actions/actions.helpers'
import { db } from '@/db'
import { bookLikes, orders, reviews, shelves } from '@/db/schema'
import { count, eq } from 'drizzle-orm'

export async function getUserDashboardData() {
  const user = await getAuthenticatedUserId()

  const getOrdersCount = db
    .select({ count: count() })
    .from(orders)
    .where(eq(orders.userId, user))
  const getLikedBooksCount = db
    .select({ count: count() })
    .from(bookLikes)
    .where(eq(bookLikes.userId, user))
  const getBookShelvesCount = db
    .select({ count: count() })
    .from(shelves)
    .where(eq(shelves.userId, user))
  const getTotalReviewsCount = db
    .select({ count: count() })
    .from(reviews)
    .where(eq(reviews.userId, user))

  const [
    [{ count: ordersCount }],
    [{ count: likedBooksCount }],
    [{ count: bookShelvesCount }],
    [{ count: totalReviewsCount }]
  ] = await Promise.all([
    getOrdersCount,
    getLikedBooksCount,
    getBookShelvesCount,
    getTotalReviewsCount
  ])

  return {
    ordersCount,
    likedBooksCount,
    bookShelvesCount,
    totalReviewsCount
  }
}
