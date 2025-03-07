'use client'

import { useDebouncedCallback } from 'use-debounce'
import { bookSearchParamsSchema } from '@/app/books/searchParams'
import { useRef, useState, useEffect, Suspense } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useQueryStates } from 'nuqs'
import { BookIcon, FilterIcon, Search, TagIcon, UserIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getTag } from '@/app/actions/tags.actions'
import { useQuery } from '@tanstack/react-query'
import { getAuthor } from '@/app/actions/authors.actions'
import { getBookWorkById } from '@/app/actions/books.actions'
import { cn } from '@/lib/utils'

interface BooksSearchProps {
  isAutoFocusable?: boolean
  isClient?: boolean
}

export function BooksSearch({ isAutoFocusable, isClient }: BooksSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState('')
  const [
    {
      q: paramsSearch,
      tags: queryTags,
      authors: queryAuthors,
      books: queryBooks
    },
    setSearchParams
  ] = useQueryStates(bookSearchParamsSchema, {
    shallow: false
  })

  const debouncedSetSearchParams = useDebouncedCallback(
    async (value: string) => {
      await setSearchParams({ q: value, page: '1' })
    },
    150
  )

  useHotkeys('ctrl+k', () => inputRef.current?.focus(), {
    preventDefault: true
  })

  useEffect(() => {
    if (isClient) return
    setSearch(paramsSearch)
  }, [paramsSearch, isClient])

  useEffect(() => {
    if (isAutoFocusable && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isAutoFocusable, search])

  const handleTagClick = (tag: string) => () => {
    setSearchParams((prev) => ({
      ...prev,
      page: '1',
      tags: queryTags.filter((t) => t !== tag)
    }))
  }
  const handleAuthorClick = (authorId: string) => () => {
    setSearchParams((prev) => ({
      ...prev,
      page: '1',
      authors: queryAuthors.filter((a) => a !== authorId)
    }))
  }
  const handleBookClick = (bookId: string) => () => {
    setSearchParams((prev) => ({
      ...prev,
      page: '1',
      books: queryBooks.filter((b) => b !== bookId)
    }))
  }

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    debouncedSetSearchParams(e.target.value)
  }

  return (
    <div className='flex flex-col space-y-4'>
      <div className='group relative mx-auto w-full max-w-xl'>
        <div className='absolute inset-0 -z-10 rounded-lg bg-linear-to-r from-rose-500/20 via-amber-500/20 to-rose-500/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100' />
        <div className='border-border/40 bg-background/80 shadow-primary/5 focus-within:border-primary/60 focus-within:shadow-primary/20 hover:border-border/60 hover:shadow-primary/10 relative flex items-center rounded-lg border shadow-lg backdrop-blur-xs transition-all duration-300'>
          <Search className='text-muted-foreground/60 ml-3 h-4 w-4' />
          <Input
            autoComplete='off'
            ref={inputRef}
            name='query'
            placeholder='Search for a recipe on reciper...'
            value={search ?? ''}
            onChange={handleSearchChange}
            className='border-0 bg-transparent text-center shadow-none focus-visible:ring-0'
          />
          {!search && (
            <kbd className='bg-muted pointer-events-none mr-2 hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex'>
              <span className='text-xs'>⌘</span>K
            </kbd>
          )}
        </div>
      </div>

      <div className='flex flex-wrap gap-2 items-center mx-auto'>
        <FilterIcon className='h-4 w-4' />
        {queryTags?.map((tag) => (
          <Suspense
            key={tag}
            fallback={
              <BadgeSkeleton
                className='bg-emerald-100 dark:bg-emerald-950/30'
                width={80}
              />
            }
          >
            <BookSearchTagBadge tagId={tag} onClick={handleTagClick(tag)} />
          </Suspense>
        ))}
        {queryAuthors?.map((author) => (
          <Suspense
            key={author}
            fallback={
              <BadgeSkeleton
                className='bg-blue-100 dark:bg-blue-950/30'
                width={100}
              />
            }
          >
            <BookSearchAuthorBadge
              authorId={author}
              onClick={handleAuthorClick(author)}
            />
          </Suspense>
        ))}
        {queryBooks?.map((book) => (
          <Suspense
            key={book}
            fallback={
              <BadgeSkeleton
                className='bg-amber-100 dark:bg-amber-950/30'
                width={120}
              />
            }
          >
            <BookSearchBookBadge
              bookId={book}
              onClick={handleBookClick(book)}
            />
          </Suspense>
        ))}
      </div>
    </div>
  )
}

function BadgeSkeleton({
  width = 80,
  className
}: {
  width?: number
  className?: string
}) {
  return (
    <Skeleton
      className={cn('h-6 rounded-full', className)}
      style={{ width: `${width}px` }}
    />
  )
}

function BookSearchAuthorBadge({
  authorId,
  onClick
}: {
  authorId: string
  onClick?: () => void
}) {
  const { data: author } = useQuery({
    queryKey: ['author', authorId],
    queryFn: async () => await getAuthor(authorId)
  })

  return (
    <Badge
      variant='outline'
      className='cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900/50'
      onClick={onClick}
    >
      <span className='flex items-center gap-1'>
        <UserIcon className='h-3 w-3' />
        {author?.name}
      </span>
    </Badge>
  )
}

function BookSearchTagBadge({
  tagId,
  onClick
}: {
  tagId: string
  onClick?: () => void
}) {
  const { data: tag } = useQuery({
    queryKey: ['tag', tagId],
    queryFn: async () => await getTag(tagId)
  })

  return (
    <Badge
      variant='outline'
      className='cursor-pointer bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800 dark:hover:bg-emerald-900/50'
      onClick={onClick}
    >
      <span className='flex items-center gap-1'>
        <TagIcon className='h-3 w-3' />
        {tag?.name}
      </span>
    </Badge>
  )
}

function BookSearchBookBadge({
  bookId,
  onClick
}: {
  bookId: string
  onClick?: () => void
}) {
  const { data: book } = useQuery({
    queryKey: ['book', bookId],
    queryFn: async () => await getBookWorkById(bookId)
  })

  return (
    <Badge
      variant='outline'
      className='cursor-pointer bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800 dark:hover:bg-amber-900/50'
      onClick={onClick}
    >
      <span className='flex items-center gap-1'>
        <BookIcon className='h-3 w-3' />
        {book?.title}
      </span>
    </Badge>
  )
}
