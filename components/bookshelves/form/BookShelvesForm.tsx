'use client'

import { getBooks } from '@/app/actions/books.actions'
import { updateShelf, upsertShelf } from '@/app/actions/bookShelves.actions'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { insertShelfSchema } from '@/db/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { BookEdition, BookShelfItems, BookWork } from '@/db/schema'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { PlusIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { useDebouncedCallback } from 'use-debounce'
import { BookCard } from './BookCard'

// Create a schema for the form that combines both insert and update schemas
const formSchema = z.object({
  name: insertShelfSchema.shape.name,
  description: insertShelfSchema.shape.description,
  isPublic: insertShelfSchema.shape.isPublic
})

type FormData = z.infer<typeof formSchema>

interface BookShelvesFormProps {
  shelf?: {
    id: string
    name: string
    description: string | null
    isPublic: boolean
    items: (BookShelfItems & {
      bookEdition: BookEdition & {
        work: BookWork
      }
    })[]
  }
}

export function BookShelvesForm({ shelf }: BookShelvesFormProps) {
  const router = useRouter()
  const isEditing = !!shelf
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<
    Array<{
      edition: BookEdition
      work: BookWork
      authors: { id: string; name: string }[]
    }>
  >([])
  const [selectedBooks, setSelectedBooks] = useState<
    Array<{
      edition: BookEdition
      work: BookWork
      authors: { id: string; name: string }[]
    }>
  >(
    shelf?.items.map((item) => ({
      edition: item.bookEdition,
      work: item.bookEdition.work,
      authors: []
    })) || []
  )

  const searchBooks = useCallback(async (query: string) => {
    try {
      const { books } = await getBooks({
        limit: 5,
        offset: 0,
        search: query
      })
      setSearchResults(books)
    } catch (error) {
      console.error('Error searching books:', error)
      toast.error('Failed to search books')
      setSearchResults([])
    }
  }, [])

  // Use debounced callback instead of debounced value
  const debouncedSearch = useDebouncedCallback((value: string) => {
    void searchBooks(value)
  }, 150)

  // Effect to handle search input changes
  useEffect(() => {
    debouncedSearch(searchQuery)
  }, [searchQuery, debouncedSearch])

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: shelf?.name ?? '',
      description: shelf?.description ?? '',
      isPublic: shelf?.isPublic ?? false
    }
  })

  async function onSubmit(data: FormData) {
    try {
      if (isEditing && shelf) {
        // Update existing shelf with selected books
        await updateShelf(
          shelf.id,
          {
            ...data
          },
          selectedBooks.map((book) => ({
            shelfId: shelf.id,
            editionId: book.edition.id,
            notes: null
          }))
        )
      } else {
        // Create new shelf with selected books
        await upsertShelf(
          data,
          selectedBooks.map((book) => ({
            shelfId: '', // This will be set by the server
            editionId: book.edition.id,
            notes: null
          }))
        )
      }

      toast.success(
        isEditing
          ? 'Bookshelf updated successfully!'
          : 'Bookshelf created successfully!'
      )
      router.push('/user/dashboard/book-shelves')
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
      console.error('Error submitting form:', error)
    }
  }

  // Handle book selection
  const toggleBook = (book: (typeof searchResults)[0]) => {
    setSelectedBooks((current) => {
      const exists = current.some((b) => b.edition.id === book.edition.id)
      if (exists) {
        return current.filter((b) => b.edition.id !== book.edition.id)
      }
      return [...current, book]
    })
    setOpen(false)
  }

  // Remove a selected book
  const removeBook = (editionId: string) => {
    setSelectedBooks((current) =>
      current.filter((book) => book.edition.id !== editionId)
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='space-y-2'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            {isEditing ? 'Edit Bookshelf' : 'Create New Bookshelf'}
          </h1>
          <p className='text-muted-foreground'>
            {isEditing
              ? 'Update your bookshelf details below'
              : 'Create a new bookshelf to organize your books'}
          </p>
        </div>

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='My Reading List' {...field} />
              </FormControl>
              <FormDescription>
                Give your bookshelf a descriptive name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='A collection of my favorite books...'
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription>
                Optional: Add a description for your bookshelf
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='isPublic'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
              <div className='space-y-0.5'>
                <FormLabel className='text-base'>Public Shelf</FormLabel>
                <FormDescription>
                  Make this bookshelf visible to other users
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-medium'>Books in Shelf</h3>
            <div className='flex items-center gap-2'>
              <Badge variant='secondary' className='font-mono'>
                {selectedBooks.length} books
              </Badge>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className='gap-2'
                    type='button'
                  >
                    <PlusIcon className='h-4 w-4' />
                    Add Book
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className='p-0'
                  align='end'
                  side='bottom'
                  sideOffset={8}
                >
                  <Command className='overflow-hidden rounded-lg border shadow-md'>
                    <CommandInput
                      placeholder='Search books...'
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {searchQuery
                          ? 'No books found.'
                          : 'Start typing to search books...'}
                      </CommandEmpty>
                      <CommandGroup>
                        {searchResults.map((book) => {
                          const isSelected = selectedBooks.some(
                            (b) => b.edition.id === book.edition.id
                          )
                          return (
                            <CommandItem
                              key={book.edition.id}
                              onSelect={() => toggleBook(book)}
                              className='px-0 aria-selected:bg-transparent'
                            >
                              <BookCard
                                book={book}
                                variant='search'
                                isSelected={isSelected}
                              />
                            </CommandItem>
                          )
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <ScrollArea className='h-[300px] rounded-md border p-4'>
            {selectedBooks.length === 0 ? (
              <div className='flex h-full items-center justify-center text-sm text-muted-foreground'>
                No books added to this shelf yet.
              </div>
            ) : (
              <div className='grid grid-cols-2 gap-4'>
                {selectedBooks.map((book) => (
                  <BookCard
                    key={book.edition.id}
                    book={book}
                    onRemove={() => removeBook(book.edition.id)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <div className='flex gap-4'>
          <Button type='submit'>
            {isEditing ? 'Update Bookshelf' : 'Create Bookshelf'}
          </Button>
          <Button type='button' variant='outline' onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
