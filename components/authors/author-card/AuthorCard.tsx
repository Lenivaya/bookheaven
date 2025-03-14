import { ZoomableImage } from '@/components/generic/ZoomableImage'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Author } from '@/db/schema'
import { cn } from '@/lib/utils'
import { CalendarIcon, CheckCircle2 } from 'lucide-react'
import { Link } from 'next-view-transitions'

import { AuthorAdminActions } from './AuthorAdminActions'
import { AuthorFollowButton } from './AuthorFollowButton'
import { AuthorViewBooksButton } from './AuthorViewBooksButton'

interface AuthorCardProps {
  author: Author
  isFollowing?: boolean
  showAdminActions?: boolean
}

// Get author initials for the avatar fallback
function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Format date to a readable string
function formatDate(date: Date) {
  return new Date(date).getFullYear().toString()
}

export default function AuthorCard({
  author,
  isFollowing = false,
  showAdminActions = false
}: AuthorCardProps) {
  return (
    <Card
      className={cn(
        'group h-full overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col relative',
        isFollowing
          ? 'border-primary/40 bg-primary/5 dark:bg-primary/10 hover:border-primary/60 dark:hover:border-primary/70'
          : 'border-border/40 bg-card/95 hover:border-primary/30 dark:bg-card/95 dark:hover:border-primary/40 dark:hover:bg-card/100'
      )}
    >
      {isFollowing && (
        <div className='absolute top-2 right-2 z-10'>
          <CheckCircle2 className='h-5 w-5 text-primary' />
        </div>
      )}

      <CardHeader className='flex flex-row items-center gap-4 p-4'>
        <Avatar
          key={author.id}
          className={cn(
            'h-16 w-16 border shadow-sm',
            isFollowing ? 'border-primary/50' : 'border-border/50'
          )}
        >
          <ZoomableImage src={author.photoUrl || ''} alt={author.name}>
            <AvatarImage src={author.photoUrl ?? undefined} alt={author.name} />
          </ZoomableImage>
          <AvatarFallback className='text-lg font-medium bg-primary/10 text-primary'>
            {getInitials(author.name)}
          </AvatarFallback>
        </Avatar>

        <div className='flex flex-col'>
          <Link
            href={`/authors/${author.id}`}
            className={cn(
              'text-lg font-semibold leading-tight tracking-tight transition-colors duration-200 dark:text-slate-50',
              isFollowing ? 'text-primary' : 'group-hover:text-primary'
            )}
          >
            {author.name}
          </Link>

          <div className='mt-1 flex flex-wrap gap-1.5'>
            {author.birthDate && (
              <Badge
                variant='outline'
                className='flex items-center gap-1 text-xs px-2 py-0.5'
              >
                <CalendarIcon className='h-3 w-3' />
                <span>{formatDate(author.birthDate)}</span>
                {author.deathDate && (
                  <span>- {formatDate(author.deathDate)}</span>
                )}
              </Badge>
            )}

            {isFollowing && (
              <Badge
                variant='secondary'
                className='bg-primary/20 text-primary hover:bg-primary/30 flex items-center gap-1 text-xs px-2 py-0.5'
              >
                Following
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className='px-4 pb-2 flex-grow'>
        {author.biography ? (
          <p className='line-clamp-3 text-sm leading-snug text-muted-foreground dark:text-slate-400/90'>
            {author.biography}
          </p>
        ) : (
          <p className='text-sm italic text-muted-foreground/70'>
            No biography available.
          </p>
        )}
      </CardContent>

      <CardFooter className='flex justify-between p-4 pt-2 mt-auto'>
        <div className='flex gap-2'>
          <AuthorViewBooksButton authorId={author.id} />
          <AuthorFollowButton
            authorId={author.id}
            initialFollowing={isFollowing}
          />
        </div>

        <div className='flex gap-2 items-center'>
          {showAdminActions && (
            <AuthorAdminActions authorId={author.id} authorName={author.name} />
          )}
          <Link href={`/authors/${author.id}`}>
            <Button variant='ghost' size='sm'>
              Profile
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
