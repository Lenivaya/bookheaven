import { ZoomableImage } from '@/components/generic/ZoomableImage'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Author } from '@/db/schema'
import {
  CalendarIcon,
  BookOpenIcon,
  HeartIcon,
  UsersIcon,
  ListIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuthorStats {
  bookCount: number
  likesCount: string | number | null
  followersCount: number
  mentionedInShelvesCount: number
}

interface AuthorProfileProps {
  author: Author
  stats: AuthorStats
  className?: string
  compact?: boolean
}

// Format date to a readable string
function formatDate(date: Date | null) {
  if (!date) return null
  return new Date(date).getFullYear().toString()
}

export function AuthorProfile({
  author,
  stats,
  className,
  compact = false
}: AuthorProfileProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className={cn('p-4', compact ? 'sm:p-5' : 'sm:p-6 md:p-8')}>
        <div
          className={cn(
            'flex flex-col gap-4',
            compact ? 'sm:flex-row sm:gap-5' : 'md:flex-row md:gap-8'
          )}
        >
          {/* Author Avatar - Responsive sizing */}
          <div className='flex flex-col items-center gap-3'>
            <Avatar
              className={cn(
                'border-4 border-background shadow-xl',
                compact
                  ? 'h-24 w-24 sm:h-28 sm:w-28'
                  : 'h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48'
              )}
            >
              <ZoomableImage src={author.photoUrl ?? ''} alt={author.name}>
                <AvatarImage
                  src={author.photoUrl ?? undefined}
                  alt={author.name}
                  className='object-cover'
                />
              </ZoomableImage>
              <AvatarFallback
                className={cn(
                  compact
                    ? 'text-xl sm:text-2xl'
                    : 'text-2xl sm:text-3xl md:text-4xl'
                )}
              >
                {author.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Birth/Death Dates */}
            {(author.birthDate || author.deathDate) && (
              <Badge
                variant='outline'
                className='flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1'
              >
                <CalendarIcon className='h-3 w-3 sm:h-4 sm:w-4' />
                <span>
                  {formatDate(author.birthDate)}
                  {author.deathDate && ` - ${formatDate(author.deathDate)}`}
                </span>
              </Badge>
            )}
          </div>

          {/* Author Info */}
          <div className='flex-1 space-y-4'>
            <div>
              <h2
                className={cn(
                  'font-bold tracking-tight mb-3',
                  compact
                    ? 'text-xl sm:text-2xl'
                    : 'text-2xl sm:text-3xl md:text-4xl'
                )}
              >
                {author.name}
              </h2>

              {/* Author Statistics - Responsive grid */}
              <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4'>
                <StatCard
                  icon={
                    <BookOpenIcon className='h-4 w-4 sm:h-5 sm:w-5 text-primary' />
                  }
                  label='Books'
                  value={stats.bookCount}
                  bgColor='bg-primary/5 border-primary/10'
                  iconBgColor='bg-primary/10'
                  compact={compact}
                />

                <StatCard
                  icon={
                    <HeartIcon className='h-4 w-4 sm:h-5 sm:w-5 text-rose-500' />
                  }
                  label='Total Likes'
                  value={stats.likesCount || 0}
                  bgColor='bg-rose-500/5 border-rose-500/10'
                  iconBgColor='bg-rose-500/10'
                  compact={compact}
                />

                <StatCard
                  icon={
                    <UsersIcon className='h-4 w-4 sm:h-5 sm:w-5 text-blue-500' />
                  }
                  label='Followers'
                  value={stats.followersCount}
                  bgColor='bg-blue-500/5 border-blue-500/10'
                  iconBgColor='bg-blue-500/10'
                  compact={compact}
                />

                <StatCard
                  icon={
                    <ListIcon className='h-4 w-4 sm:h-5 sm:w-5 text-amber-500' />
                  }
                  label='In Shelves'
                  value={stats.mentionedInShelvesCount}
                  bgColor='bg-amber-500/5 border-amber-500/10'
                  iconBgColor='bg-amber-500/10'
                  compact={compact}
                />
              </div>
            </div>

            {author.biography && (
              <div
                className={cn(
                  'prose dark:prose-invert max-w-none',
                  compact ? 'prose-xs sm:prose-sm' : 'prose-sm sm:prose-md'
                )}
              >
                <p
                  className={cn(
                    'leading-relaxed text-muted-foreground whitespace-pre-line',
                    compact
                      ? 'text-xs sm:text-sm line-clamp-4'
                      : 'text-sm sm:text-md'
                  )}
                >
                  {author.biography}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Reusable stat card component
interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number | null
  bgColor: string
  iconBgColor: string
  compact?: boolean
}

function StatCard({
  icon,
  label,
  value,
  bgColor,
  iconBgColor,
  compact = false
}: StatCardProps) {
  return (
    <Card className={bgColor}>
      <CardContent
        className={cn(
          'flex items-center gap-2',
          compact ? 'p-1.5 sm:p-2' : 'p-2 sm:p-4'
        )}
      >
        <div
          className={cn(
            'rounded-lg',
            iconBgColor,
            compact ? 'p-1 sm:p-1.5' : 'p-1.5 sm:p-2'
          )}
        >
          {icon}
        </div>
        <div>
          <p
            className={cn(
              'font-medium text-muted-foreground',
              compact ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm'
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              'font-bold',
              compact ? 'text-base sm:text-lg' : 'text-lg sm:text-2xl'
            )}
          >
            {value ?? 0}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
