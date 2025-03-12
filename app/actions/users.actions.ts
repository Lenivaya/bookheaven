'use server'

import { clerkClient } from '@clerk/nextjs/server'

/**
 * Get user by their id from clerk
 */
export async function getUser(userId: string) {
  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const { firstName, lastName, username, imageUrl } = user
  return { firstName, lastName, username, imageUrl }
}
