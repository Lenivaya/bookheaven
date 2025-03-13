import { checkRole } from '@/lib/auth/utils'
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

/**
 * Ensures user is admin
 */
export async function ensureAdmin(errorMessage = 'User must be admin') {
  const isAdmin = await checkRole('admin')
  if (!isAdmin) throw new Error(errorMessage)
}
