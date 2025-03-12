'use client'

import { useDebouncedCallback } from 'use-debounce'
import { authorSearchParamsSchema } from '@/app/authors/searchParams'
import { useRef, useState, useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useQueryStates } from 'nuqs'
import { Search, UserIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface AuthorsSearchProps {
  isAutoFocusable?: boolean
  isClient?: boolean
}

export function AuthorsSearch({
  isAutoFocusable,
  isClient
}: AuthorsSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState('')
  const [{ q: paramsSearch }, setSearchParams] = useQueryStates(
    authorSearchParamsSchema,
    {
      shallow: false
    }
  )

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

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    debouncedSetSearchParams(e.target.value)
  }

  return (
    <div className='flex flex-col space-y-4'>
      <div className='group relative mx-auto w-full max-w-xl'>
        <div className='absolute inset-0 -z-10 rounded-lg bg-linear-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100' />
        <div className='border-border/40 bg-background/80 shadow-primary/5 focus-within:border-primary/60 focus-within:shadow-primary/20 hover:border-border/60 hover:shadow-primary/10 relative flex items-center rounded-lg border shadow-lg backdrop-blur-xs transition-all duration-300'>
          <Search className='text-muted-foreground/60 ml-3 h-4 w-4' />
          <Input
            autoComplete='off'
            ref={inputRef}
            name='query'
            placeholder='Search for authors by name, biography...'
            value={search ?? ''}
            onChange={handleSearchChange}
            className='border-0 bg-transparent text-center shadow-none focus-visible:ring-0'
          />
          <div className='flex items-center pr-3'>
            <kbd
              className={cn(
                'pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100',
                search && 'opacity-0'
              )}
            >
              <span className='text-xs'>⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      {search && (
        <div className='flex items-center justify-center'>
          <div className='flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary'>
            <UserIcon className='h-3.5 w-3.5' />
            <span>Searching for &quot;{search}&quot;</span>
          </div>
        </div>
      )}
    </div>
  )
}
