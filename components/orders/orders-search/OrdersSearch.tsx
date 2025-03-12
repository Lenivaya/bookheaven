'use client'

import { useDebouncedCallback } from 'use-debounce'
import { orderSearchParamsSchema } from '@/app/user/dashboard/orders/searchParams'
import { useRef, useState } from 'react'
import { useQueryStates } from 'nuqs'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface OrdersSearchProps {
  isAutoFocusable?: boolean
}

export function OrdersSearch({ isAutoFocusable }: OrdersSearchProps) {
  const [queryStates, setQueryStates] = useQueryStates(
    orderSearchParamsSchema,
    {
      history: 'push',
      shallow: false
    }
  )
  const [searchValue, setSearchValue] = useState(queryStates.q)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearchChange = useDebouncedCallback(async (value: string) => {
    await setQueryStates({
      q: value,
      page: '1' // Reset to first page on new search
    })
  }, 300)

  return (
    <div className='relative'>
      <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
      <Input
        ref={inputRef}
        type='search'
        placeholder='Search orders...'
        className='pl-8 text-center'
        value={searchValue}
        autoFocus={isAutoFocusable}
        onChange={(e) => {
          setSearchValue(e.target.value)
          handleSearchChange(e.target.value)
        }}
      />
    </div>
  )
}
