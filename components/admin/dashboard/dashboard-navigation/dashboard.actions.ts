'use server'

import { db } from '@/db'
import {
  authors,
  bookEditions,
  orders,
  reviews,
  shelves,
  tags
} from '@/db/schema'
import { count } from 'drizzle-orm'

export async function getAdminDashboardData() {
  const getOrdersCount = db.select({ count: count() }).from(orders)
  const getAuthorsCount = db.select({ count: count() }).from(authors)
  const getBooksCount = db.select({ count: count() }).from(bookEditions)
  const getBookShelvesCount = db.select({ count: count() }).from(shelves)
  const getTotalReviewsCount = db.select({ count: count() }).from(reviews)
  const getTotalTagsCount = db.select({ count: count() }).from(tags)

  const [
    [{ count: ordersCount }],
    [{ count: authorsCount }],
    [{ count: booksCount }],
    [{ count: bookShelvesCount }],
    [{ count: totalReviewsCount }],
    [{ count: totalTagsCount }]
  ] = await Promise.all([
    getOrdersCount,
    getAuthorsCount,
    getBooksCount,
    getBookShelvesCount,
    getTotalReviewsCount,
    getTotalTagsCount
  ])

  return {
    ordersCount,
    authorsCount,
    booksCount,
    bookShelvesCount,
    totalReviewsCount,
    totalTagsCount
  }
}
