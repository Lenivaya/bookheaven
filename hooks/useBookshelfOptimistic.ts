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
  const queryKey = ['userShelves']

  // Query to get user shelves with items
  const {
    data: userShelves = [],
    isLoading: isShelvesLoading,
    isError: isShelvesError
  } = useQuery({
    queryKey,
    queryFn: () => getUserShelvesWithItems(systemShelves),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000
  })

  // Build lookup maps for efficient access
  const shelfByName = new Map(userShelves.map((shelf) => [shelf.name, shelf]))

  const shelfWithBook = userShelves.find((shelf) =>
    shelf.items?.some((item) => item.editionId === editionId)
  )

  // Derived state
  const currentShelf = shelfWithBook?.name as DefaultShelves | undefined | null
  const isBookmarked = !!shelfWithBook
  const shelfId = shelfWithBook?.id || null

  /**
   * Updates the cache optimistically
   */
  const updateCache = (newShelfName: DefaultShelves | null) => {
    queryClient.setQueryData(queryKey, (oldData: Shelf[] | undefined) => {
      if (!oldData || !Array.isArray(oldData)) return oldData

      // Create a deep copy
      const newData = JSON.parse(JSON.stringify(oldData)) as Shelf[]

      // Create a lookup map for the new data
      const shelvesByName: Record<string, Shelf> = {}
      for (const shelf of newData) {
        if (shelf && typeof shelf === 'object' && 'name' in shelf) {
          shelvesByName[shelf.name] = shelf
        }
      }

      // Handle removal from current shelf
      if (currentShelf && (!newShelfName || newShelfName !== currentShelf)) {
        const currentShelfObj = shelvesByName[currentShelf]
        if (currentShelfObj && Array.isArray(currentShelfObj.items)) {
          currentShelfObj.items = currentShelfObj.items.filter(
            (item) => item.editionId !== editionId
          )
        }
      }

      // Handle addition to new shelf
      if (newShelfName) {
        const targetShelf = shelvesByName[newShelfName]
        if (targetShelf) {
          // Ensure items is an array
          if (!Array.isArray(targetShelf.items)) {
            targetShelf.items = []
          }

          // Only add if not already present
          if (!targetShelf.items.some((item) => item.editionId === editionId)) {
            targetShelf.items.push({
              editionId,
              shelfId: targetShelf.id
            })
          }
        }
      }

      return newData
    })
  }

  /**
   * Common mutation configuration factory
   */
  const createMutation = (
    action: 'add' | 'remove',
    mutationFn: (shelfName: DefaultShelves) => Promise<any>,
    updateFn: (shelfName: DefaultShelves) => void
  ) => {
    return useMutation({
      mutationFn,
      onMutate: async (shelfName) => {
        await queryClient.cancelQueries({ queryKey })
        const previousData = queryClient.getQueryData(queryKey)
        updateFn(shelfName)
        return { previousData }
      },
      onError: (error, variables, context) => {
        // Restore previous data on error
        if (context?.previousData) {
          queryClient.setQueryData(queryKey, context.previousData)
        }
        console.error(
          `Failed to ${action} book ${action === 'add' ? 'to' : 'from'} shelf:`,
          error
        )
        toast.error(
          `Failed to ${action} "${bookTitle}" ${action === 'add' ? 'to' : 'from'} ${variables}`
        )
      },
      onSettled: () => {
        // Always refetch after settled to ensure data consistency
        queryClient.invalidateQueries({ queryKey })
      },
      onSuccess: (_, shelfName) => {
        toast.success(
          `${action === 'add' ? 'Added' : 'Removed'} "${bookTitle}" ${action === 'add' ? 'to' : 'from'} ${shelfName}`
        )
      }
    })
  }

  // Add to shelf mutation
  const addToShelfMutation = createMutation(
    'add',
    (shelfName) => upsertShelfItemWithShelfName({ editionId }, shelfName),
    (shelfName) => updateCache(shelfName)
  )

  // Remove from shelf mutation
  const removeFromShelfMutation = createMutation(
    'remove',
    async (shelfName) => {
      const shelf = shelfByName.get(shelfName)
      if (!shelf) throw new Error(`Shelf ${shelfName} not found`)
      return deleteShelfItem(shelf.id, editionId)
    },
    () => updateCache(null)
  )

  /**
   * Handles shelf selection with optimistic updates
   */
  const handleShelfSelect = async (shelf: DefaultShelves) => {
    try {
      // If selecting the current shelf, remove the book from it
      if (currentShelf === shelf) {
        removeFromShelfMutation.mutate(shelf)
        return
      }

      // If moving from one shelf to another
      if (currentShelf) {
        await queryClient.cancelQueries({ queryKey })
        const previousData = queryClient.getQueryData(queryKey)

        // Optimistic update
        updateCache(shelf)

        try {
          const currentShelfObj = shelfByName.get(currentShelf)
          if (currentShelfObj) {
            await deleteShelfItem(currentShelfObj.id, editionId)
            await upsertShelfItemWithShelfName({ editionId }, shelf)
            toast.success(
              `Moved "${bookTitle}" from ${currentShelf} to ${shelf}`
            )
          }
        } catch (error) {
          // Restore previous data on error
          queryClient.setQueryData(queryKey, previousData)
          console.error('Failed to move book between shelves:', error)
          toast.error(`Failed to move "${bookTitle}" to ${shelf}`)
          queryClient.invalidateQueries({ queryKey })
        }
        return
      }

      // If not on any shelf, add to the selected shelf
      addToShelfMutation.mutate(shelf)
    } catch (error) {
      console.error('Error in handleShelfSelect:', error)
      toast.error(`Failed to update shelf for "${bookTitle}"`)
      // Ensure data is refreshed
      queryClient.invalidateQueries({ queryKey })
    }
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
