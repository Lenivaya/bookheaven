'use client'

import { Tag } from '@/db/schema'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useQueryStates } from 'nuqs'
import { bookSearchParamsSchema } from '@/app/books/searchParams'

interface BookTagsListProps {
  tags: Tag[]
  onTagClick?: (tagId: string) => void
}

export function BookTagsList({ tags, onTagClick }: BookTagsListProps) {
  const [showAllTags, setShowAllTags] = useState(false)

  const [{ tags: queryTags }, setSearchParams] = useQueryStates(
    bookSearchParamsSchema,
    {
      shallow: false
    }
  )

  if (tags.length === 0) {
    return null
  }

  const handleTagClick = (tagId: string) => {
    const isTagAlreadySelected = queryTags.includes(tagId)
    if (isTagAlreadySelected) {
      setSearchParams({ tags: queryTags.filter((t) => t !== tagId) })
    } else {
      setSearchParams({ tags: [tagId, ...queryTags] })
    }
    onTagClick?.(tagId)
  }

  const displayedTags = showAllTags ? tags : tags.slice(0, 2)
  const hasMoreTags = tags.length > 2

  return (
    <div className='flex flex-wrap items-center gap-1 w-full'>
      {displayedTags.map((tag) => (
        <Badge
          key={tag.id}
          variant='secondary'
          className='text-[9px] px-1 py-0 h-3.5 rounded-sm dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer'
          onClick={(e) => {
            e.preventDefault() // Prevent navigation from the parent Link
            handleTagClick(tag.id)
          }}
        >
          {tag.name}
        </Badge>
      ))}

      {hasMoreTags && (
        <Button
          variant='ghost'
          size='sm'
          className='h-3.5 w-auto p-0 text-[9px] text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-slate-300'
          onClick={(e) => {
            e.preventDefault() // Prevent navigation from the parent Link
            setShowAllTags(!showAllTags)
          }}
        >
          <span className='flex items-center gap-0.5'>
            {showAllTags ? (
              <ChevronUp className='h-2 w-2' />
            ) : (
              <ChevronDown className='h-2 w-2' />
            )}
            {showAllTags ? 'less' : `+${tags.length - 2}`}
          </span>
        </Button>
      )}
    </div>
  )
}
