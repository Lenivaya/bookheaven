'use client'

import { bookSearchParamsSchema } from '@/app/books/searchParams'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tag } from '@/db/schema'
import { useQueryStates } from 'nuqs'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface TagWithColor extends Tag {
  colorClass: string
  displayName: string
}

interface ClientTagsInteractionProps {
  tags: TagWithColor[]
}

export function ClientTagsInteraction({ tags }: ClientTagsInteractionProps) {
  const [showAllTags, setShowAllTags] = useState(false)

  const [{ tags: queryTags }, setSearchParams] = useQueryStates(
    bookSearchParamsSchema,
    {
      shallow: false
    }
  )

  const handleTagClick = (tagId: string) => {
    const isTagAlreadySelected = queryTags.includes(tagId)
    if (isTagAlreadySelected) {
      setSearchParams({ tags: queryTags.filter((t) => t !== tagId) })
    } else {
      setSearchParams({ tags: [tagId, ...queryTags] })
    }
  }

  // Dynamically adjust how many tags to show based on screen size
  let tagsToShow = 1 // Default for smallest screens

  if (typeof window !== 'undefined') {
    if (window.innerWidth < 400) {
      tagsToShow = showAllTags ? tags.length : 1
    } else if (window.innerWidth < 640) {
      tagsToShow = showAllTags ? tags.length : Math.min(2, tags.length)
    } else {
      tagsToShow = showAllTags ? tags.length : Math.min(3, tags.length)
    }
  } else {
    // Server-side rendering fallback
    tagsToShow = showAllTags ? tags.length : Math.min(2, tags.length)
  }

  const displayedTags = showAllTags ? tags : tags.slice(0, tagsToShow)
  const hasMoreTags = tags.length > tagsToShow

  return (
    <div className='flex flex-wrap items-center gap-0.5 xs:gap-1 w-full'>
      {displayedTags.map((tag) => {
        const isSelected = queryTags.includes(tag.id)

        return (
          <Badge
            key={tag.id}
            variant='outline'
            className={`text-[9px] xs:text-[10px] sm:text-xs font-medium px-1 xs:px-1.5 py-0 h-3.5 xs:h-4 sm:h-5 rounded-md cursor-pointer transition-all duration-200 border-transparent max-w-[70px] xs:max-w-[90px] sm:max-w-[110px] ${tag.colorClass} ${
              isSelected ? 'ring-1 ring-primary/50' : ''
            }`}
            onClick={(e) => {
              e.preventDefault() // Prevent navigation from the parent Link
              handleTagClick(tag.id)
            }}
            title={tag.name} // Show full name on hover
          >
            <span className='truncate'>{tag.displayName}</span>
          </Badge>
        )
      })}

      {hasMoreTags && (
        <Button
          variant='ghost'
          size='sm'
          className='h-3.5 xs:h-4 sm:h-5 w-auto p-0 text-[9px] xs:text-[10px] sm:text-xs text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-slate-300 transition-colors duration-200'
          onClick={(e) => {
            e.preventDefault() // Prevent navigation from the parent Link
            setShowAllTags(!showAllTags)
          }}
        >
          <span className='flex items-center gap-0.5'>
            {showAllTags ? (
              <ChevronUp className='h-2 xs:h-2 sm:h-2.5 w-2 xs:w-2 sm:w-2.5' />
            ) : (
              <ChevronDown className='h-2 xs:h-2 sm:h-2.5 w-2 xs:w-2 sm:w-2.5' />
            )}
            {showAllTags ? 'less' : `+${tags.length - tagsToShow}`}
          </span>
        </Button>
      )}
    </div>
  )
}
