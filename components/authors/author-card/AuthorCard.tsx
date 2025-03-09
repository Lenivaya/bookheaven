import { Author } from '@/db/schema'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import Link from 'next/link'
import { AuthorFollowButton } from './AuthorFollowButton'
import { AuthorViewBooksButton } from './AuthorViewBooksButton'
import { ZoomableImage } from '@/components/generic/zoomable-image'

interface AuthorCardProps {
  author: Author
  isFollowing?: boolean
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
  isFollowing = false
}: AuthorCardProps) {
  return (
    <Card className='group h-full overflow-hidden border-border/40 bg-card/95 transition-all duration-300 hover:border-primary/30 hover:shadow-md dark:bg-card/95 dark:hover:border-primary/40 dark:hover:bg-card/100 flex flex-col'>
      <CardHeader className='flex flex-row items-center gap-4 p-4'>
        <ZoomableImage src={author.photoUrl || ''} alt={author.name}>
          <Avatar className='h-16 w-16 border border-border/50 shadow-sm'>
            <AvatarImage src={author.photoUrl || ''} alt={author.name} />
            <AvatarFallback className='text-lg font-medium bg-primary/10 text-primary'>
              {getInitials(author.name)}
            </AvatarFallback>
          </Avatar>
        </ZoomableImage>

        <div className='flex flex-col'>
          <Link
            href={`/authors/${author.id}`}
            className='text-lg font-semibold leading-tight tracking-tight group-hover:text-primary transition-colors duration-200 dark:text-slate-50'
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

        <Link href={`/authors/${author.id}`}>
          <Button variant='ghost' size='sm'>
            Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
