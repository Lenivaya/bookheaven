'use client'

import { Tag } from '@/db/schema'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Tag as TagIcon } from 'lucide-react'
import { useQueryStates } from 'nuqs'
import { bookSearchParamsSchema } from '@/app/books/searchParams'

interface BookTagsListProps {
  tags: Tag[]
  onTagClick?: (tagId: string) => void
}

// Function to generate a consistent color based on tag name
function getTagColor(tagName: string) {
  // Simple hash function to generate a number from a string
  const hash = tagName.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)

  // List of warm, book-themed colors (rich, muted tones)
  const colors = [
    'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:hover:bg-amber-800/60',
    'bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-200 dark:hover:bg-rose-800/60',
    'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:hover:bg-emerald-800/60',
    'bg-sky-100 text-sky-800 hover:bg-sky-200 dark:bg-sky-900/40 dark:text-sky-200 dark:hover:bg-sky-800/60',
    'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:hover:bg-purple-800/60',
    'bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/40 dark:text-orange-200 dark:hover:bg-orange-800/60',
    'bg-teal-100 text-teal-800 hover:bg-teal-200 dark:bg-teal-900/40 dark:text-teal-200 dark:hover:bg-teal-800/60',
    'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-200 dark:hover:bg-indigo-800/60'
  ]

  // Use the hash to select a color
  return colors[Math.abs(hash) % colors.length]
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
    return (
      <div className='flex items-center text-xs text-muted-foreground dark:text-slate-500'>
        <TagIcon className='h-3 w-3 mr-1 opacity-70' />
        <span>No tags</span>
      </div>
    )
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

  // Dynamically adjust how many tags to show based on total count
  let tagsToShow = 2 // Default
  if (tags.length === 1) {
    tagsToShow = 1
  } else if (tags.length === 3) {
    tagsToShow = 2
  } else if (tags.length >= 4) {
    tagsToShow = showAllTags ? tags.length : 2
  }

  const displayedTags = showAllTags ? tags : tags.slice(0, tagsToShow)
  const hasMoreTags = tags.length > tagsToShow

  return (
    <div className='flex flex-wrap items-center gap-1 w-full'>
      {displayedTags.map((tag) => {
        const colorClass = getTagColor(tag.name)
        const isSelected = queryTags.includes(tag.id)

        // Truncate long tag names
        const displayName =
          tag.name.length > 15 ? `${tag.name.substring(0, 14)}…` : tag.name

        return (
          <Badge
            key={tag.id}
            variant='outline'
            className={`text-xs font-medium px-1.5 py-0 h-5 rounded-md cursor-pointer transition-all duration-200 border-transparent max-w-[110px] ${colorClass} ${
              isSelected ? 'ring-1 ring-primary/50' : ''
            }`}
            onClick={(e) => {
              e.preventDefault() // Prevent navigation from the parent Link
              handleTagClick(tag.id)
            }}
            title={tag.name} // Show full name on hover
          >
            <span className='truncate'>{displayName}</span>
          </Badge>
        )
      })}

      {hasMoreTags && (
        <Button
          variant='ghost'
          size='sm'
          className='h-5 w-auto p-0 text-xs text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-slate-300 transition-colors duration-200'
          onClick={(e) => {
            e.preventDefault() // Prevent navigation from the parent Link
            setShowAllTags(!showAllTags)
          }}
        >
          <span className='flex items-center gap-0.5'>
            {showAllTags ? (
              <ChevronUp className='h-2.5 w-2.5' />
            ) : (
              <ChevronDown className='h-2.5 w-2.5' />
            )}
            {showAllTags ? 'less' : `+${tags.length - tagsToShow}`}
          </span>
        </Button>
      )}
    </div>
  )
}
