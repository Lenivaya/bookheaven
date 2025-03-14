'use server'

import { db } from '@/db'
import { getAuthenticatedUserId } from './actions.helpers'
import { authorFollowers } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { isNone, isSome } from '@/lib/types'
import { auth } from '@clerk/nextjs/server'

/**
 * Server action to check if a user is following an author
 **/
export async function isFollowingAuthor(authorId: string) {
  const { userId } = await auth()
  if (isNone(userId)) return false
  const follower = await db.query.authorFollowers.findFirst({
    where: and(
      eq(authorFollowers.userId, userId),
      eq(authorFollowers.authorId, authorId)
    )
  })
  return isSome(follower)
}

/**
 * Server action to follow an author
 **/
export async function followAuthor(authorId: string) {
  const userId = await getAuthenticatedUserId()
  await db.insert(authorFollowers).values({ userId, authorId })
}

/**
 * Server action to unfollow an author
 **/
export async function unfollowAuthor(authorId: string) {
  const userId = await getAuthenticatedUserId()
  await db
    .delete(authorFollowers)
    .where(
      and(
        eq(authorFollowers.userId, userId),
        eq(authorFollowers.authorId, authorId)
      )
    )
}
