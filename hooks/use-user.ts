import { getUser } from '@/app/actions/users.actions'
import { useQuery } from '@tanstack/react-query'

export const userQueryKey = (userId: string) => ['user', userId] as const

// Cache configuration for user data
const userQueryConfig = {
  staleTime: 1000 * 60 * 60, // Data stays fresh for 1 hour
  cacheTime: 1000 * 60 * 60 * 24, // Keep unused data in cache for 24 hours
  refetchOnMount: false, // Don't refetch when component mounts if data exists
  refetchOnWindowFocus: false, // Don't refetch when window regains focus
  refetchOnReconnect: false // Don't refetch when internet reconnects
}

/**
 * Hook to fetch and cache user data
 * @param userId - The ID of the user to fetch
 * @returns Query result containing user data and loading state
 */
export function useUser(userId: string) {
  return useQuery({
    queryKey: userQueryKey(userId),
    queryFn: () => getUser(userId),
    ...userQueryConfig
  })
}
