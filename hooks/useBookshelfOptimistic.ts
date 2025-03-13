import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  deleteShelfItem,
  getUserShelvesWithItems,
  upsertShelfItemWithShelfName
} from '@/app/actions/bookShelves.actions'
import { DefaultShelves } from '@/lib/constants'

interface UseBookshelfOptimisticOptions {
  /**
   * The ID of the book edition
   */
  editionId: string
  /**
   * The title of the book (for toast messages)
   */
  bookTitle: string
  /**
   * List of default system shelves to include
   */
  systemShelves?: DefaultShelves[]
}

type ShelfItem = {
  editionId: string
  shelfId: string
}

type Shelf = {
  id: string
  name: string
  items: ShelfItem[]
}

/**
 * A custom hook for implementing optimistic UI updates for bookshelves
 */
export function useBookshelfOptimistic({
  editionId,
  bookTitle,
  systemShelves
}: UseBookshelfOptimisticOptions) {
  const queryClient = useQueryClient()

  // Query to get user shelves with items
  const {
    data: userShelves,
    isLoading: isShelvesLoading,
    isError: isShelvesError
  } = useQuery({
    queryKey: ['userShelves'],
    queryFn: () => getUserShelvesWithItems(systemShelves),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000
  })

  // Calculate current shelf and bookmarked status
  const { currentShelf, isBookmarked, shelfId } = (() => {
    if (!userShelves)
      return { currentShelf: null, isBookmarked: false, shelfId: null }

    const shelfWithBook = userShelves.find((shelf) =>
      shelf.items.some((item) => item.editionId === editionId)
    )

    return {
      currentShelf: shelfWithBook?.name as DefaultShelves | null,
      isBookmarked: !!shelfWithBook,
      shelfId: shelfWithBook?.id || null
    }
  })()

  // Helper function to update the cache optimistically
  const updateShelvesCache = (newShelfName: DefaultShelves | null) => {
    queryClient.setQueryData(
      ['userShelves'],
      (oldData: Shelf[] | undefined) => {
        if (!oldData) return oldData

        // Create a deep copy of the shelves data
        const newData = JSON.parse(JSON.stringify(oldData)) as Shelf[]

        // If removing from a shelf
        if (currentShelf && (!newShelfName || newShelfName !== currentShelf)) {
          // Find the current shelf and remove the book from it
          const currentShelfObj = newData.find((s) => s.name === currentShelf)
          if (currentShelfObj) {
            currentShelfObj.items = currentShelfObj.items.filter(
              (item) => item.editionId !== editionId
            )
          }
        }

        // If adding to a new shelf
        if (newShelfName) {
          // Find or create the new shelf
          let newShelfObj = newData.find((s) => s.name === newShelfName)

          // If the shelf exists, add the book to it
          if (newShelfObj) {
            // Only add if not already there
            if (
              !newShelfObj.items.some((item) => item.editionId === editionId)
            ) {
              newShelfObj.items.push({
                editionId,
                shelfId: newShelfObj.id
              })
            }
          }
        }

        return newData
      }
    )
  }

  // Mutation to add a book to a shelf with optimistic updates
  const addToShelfMutation = useMutation({
    mutationFn: (shelfName: DefaultShelves) =>
      upsertShelfItemWithShelfName({ editionId }, shelfName),
    // Optimistic update
    onMutate: async (shelfName) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ['userShelves'] })

      // Snapshot the previous data
      const previousData = queryClient.getQueryData(['userShelves'])

      // Optimistically update the cache
      updateShelvesCache(shelfName)

      // Return a context object with the previous data
      return { previousData }
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (error, variables, context) => {
      // Roll back to the previous data
      queryClient.setQueryData(['userShelves'], context?.previousData)
      console.error('Failed to add book to shelf:', error)
      toast.error(`Failed to add "${bookTitle}" to ${variables}`)
    },
    // Only refetch on error to ensure data consistency
    onSettled: (data, error) => {
      if (error) {
        queryClient.invalidateQueries({ queryKey: ['userShelves'] })
      }
    },
    onSuccess: (_, shelfName) => {
      toast.success(`Added "${bookTitle}" to ${shelfName}`)
    }
  })

  // Mutation to remove a book from a shelf with optimistic updates
  const removeFromShelfMutation = useMutation({
    mutationFn: async (shelfName: DefaultShelves) => {
      const shelf = userShelves?.find((s) => s.name === shelfName)
      if (!shelf) throw new Error(`Shelf ${shelfName} not found`)
      return deleteShelfItem(shelf.id, editionId)
    },
    // Optimistic update
    onMutate: async (shelfName) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ['userShelves'] })

      // Snapshot the previous data
      const previousData = queryClient.getQueryData(['userShelves'])

      // Optimistically update the cache
      updateShelvesCache(null)

      // Return a context object with the previous data
      return { previousData }
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (error, variables, context) => {
      // Roll back to the previous data
      queryClient.setQueryData(['userShelves'], context?.previousData)
      console.error('Failed to remove book from shelf:', error)
      toast.error(`Failed to remove "${bookTitle}" from ${variables}`)
    },
    // Only refetch on error to ensure data consistency
    onSettled: (data, error) => {
      if (error) {
        queryClient.invalidateQueries({ queryKey: ['userShelves'] })
      }
    },
    onSuccess: (_, shelfName) => {
      toast.success(`Removed "${bookTitle}" from ${shelfName}`)
    }
  })

  // Function to handle shelf selection with optimistic updates
  const handleShelfSelect = async (shelf: DefaultShelves) => {
    // If selecting the current shelf, remove the book from it
    if (currentShelf === shelf) {
      removeFromShelfMutation.mutate(shelf, undefined)
      return
    }

    // If moving from one shelf to another, handle it optimistically
    if (currentShelf) {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['userShelves'] })

      // Snapshot the previous data
      const previousData = queryClient.getQueryData(['userShelves'])

      // Optimistically update the cache
      updateShelvesCache(shelf)

      try {
        // Find the current shelf object
        const currentShelfObj = userShelves?.find(
          (s) => s.name === currentShelf
        )

        if (currentShelfObj) {
          // Perform the actual operations
          await deleteShelfItem(currentShelfObj.id, editionId)
          await upsertShelfItemWithShelfName({ editionId }, shelf)

          toast.success(`Moved "${bookTitle}" from ${currentShelf} to ${shelf}`)
        }
      } catch (error) {
        // Roll back to the previous data
        queryClient.setQueryData(['userShelves'], previousData)
        console.error('Failed to move book between shelves:', error)
        toast.error(`Failed to move "${bookTitle}" to ${shelf}`)

        // Refetch to ensure data consistency
        queryClient.invalidateQueries({ queryKey: ['userShelves'] })
      }
      return
    }

    // If not on any shelf, add to the selected shelf
    addToShelfMutation.mutate(shelf, undefined)
  }

  return {
    userShelves,
    isShelvesLoading,
    isShelvesError,
    currentShelf,
    isBookmarked,
    shelfId,
    addToShelfMutation,
    removeFromShelfMutation,
    handleShelfSelect,
    isPending: addToShelfMutation.isPending || removeFromShelfMutation.isPending
  }
}
