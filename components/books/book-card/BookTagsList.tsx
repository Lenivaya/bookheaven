import { Tag } from '@/db/schema'
import { TagIcon } from 'lucide-react'
import { ClientTagsInteraction } from './ClientTagsInteraction'

interface BookTagsListProps {
  tags: Tag[]
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

export function BookTagsList({ tags }: BookTagsListProps) {
  if (tags.length === 0) {
    return (
      <div className='flex items-center text-xs text-muted-foreground dark:text-slate-500'>
        <TagIcon className='h-3 w-3 mr-1 opacity-70' />
        <span>No tags</span>
      </div>
    )
  }

  // Generate tag colors on the server
  const tagsWithColors = tags.map((tag) => ({
    ...tag,
    colorClass: getTagColor(tag.name),
    displayName:
      tag.name.length > 15 ? `${tag.name.substring(0, 14)}…` : tag.name
  }))

  return <ClientTagsInteraction tags={tagsWithColors} />
}
