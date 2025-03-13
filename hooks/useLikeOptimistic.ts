import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface UseLikeOptimisticOptions<T extends (...args: any[]) => Promise<any>> {
  /**
   * The ID of the item being liked (book, shelf, etc.)
   */
  itemId: string
  /**
   * The initial like count
   */
  initialLikesCount?: number
  /**
   * The query key prefix for the like status (e.g., 'isLikedBook', 'isLikedShelf')
   */
  queryKeyPrefix: string
  /**
   * Function to check if the item is liked
   */
  checkLikeStatusFn: (id: string) => Promise<boolean>
  /**
   * Function to toggle the like status
   */
  toggleLikeFn: T
  /**
   * Custom error message to show when the like operation fails
   */
  errorMessage?: string
}

/**
 * A custom hook for implementing optimistic UI updates for likes
 */
export function useLikeOptimistic<T extends (...args: any[]) => Promise<any>>({
  itemId,
  initialLikesCount = 0,
  queryKeyPrefix,
  checkLikeStatusFn,
  toggleLikeFn,
  errorMessage = 'Failed to update like status. Please try again.'
}: UseLikeOptimisticOptions<T>) {
  const queryClient = useQueryClient()
  const [optimisticLikesCount, setOptimisticLikesCount] =
    useState(initialLikesCount)

  // Query to check if the item is liked
  const { data: isLiked = false, isLoading: isLikeStatusLoading } = useQuery({
    queryKey: [queryKeyPrefix, itemId],
    queryFn: () => checkLikeStatusFn(itemId)
  })

  // Mutation to toggle the like status with optimistic updates
  const likeMutation = useMutation({
    mutationFn: toggleLikeFn,
    // Optimistic update
    onMutate: async () => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: [queryKeyPrefix, itemId] })

      // Snapshot the previous values
      const previousLikeStatus = queryClient.getQueryData([
        queryKeyPrefix,
        itemId
      ])
      const previousCount = optimisticLikesCount

      // Optimistically update to the new values
      queryClient.setQueryData([queryKeyPrefix, itemId], !previousLikeStatus)

      // Update the optimistic like count
      setOptimisticLikesCount((prev) =>
        previousLikeStatus ? prev - 1 : prev + 1
      )

      // Return a context object with the previous values
      return { previousLikeStatus, previousCount }
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        [queryKeyPrefix, itemId],
        context?.previousLikeStatus
      )
      // Roll back the optimistic like count
      if (context?.previousCount !== undefined) {
        setOptimisticLikesCount(context.previousCount)
      }
      toast.error(errorMessage)
    },
    // Always refetch after error or success to ensure data consistency
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeyPrefix, itemId]
      })
    }
  })

  return {
    isLiked,
    isLikeStatusLoading,
    likeMutation,
    optimisticLikesCount
  }
}
