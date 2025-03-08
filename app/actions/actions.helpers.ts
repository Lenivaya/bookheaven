import { isNone } from '@/lib/types'
import { auth } from '@clerk/nextjs/server'

/**
 * Get authenticated user ID or throw error if not authenticated
 */
export async function getAuthenticatedUserId(
  errorMessage = 'User must be logged in'
) {
  const userId = await auth()
  if (isNone(userId.userId)) {
    throw new Error(errorMessage)
  }
  return userId.userId
}
