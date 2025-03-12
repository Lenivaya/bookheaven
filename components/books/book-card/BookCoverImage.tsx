'use client'

import Image from 'next/image'
import { Suspense, useState } from 'react'
import { ImageOff, Loader2 } from 'lucide-react'
import { ZoomableImage } from '@/components/generic/ZoomableImage'
import { cn } from '@/lib/utils'
import { LikeButton } from './LikeButton'
import { Protect } from '@clerk/nextjs'
import { unstable_ViewTransition as ViewTransition } from 'react'

interface BookCoverImageProps {
  thumbnailUrl: string | null
  title: string
  bookEditionId: string
}

export function BookCoverImage({
  thumbnailUrl,
  title,
  bookEditionId
}: BookCoverImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  if (!thumbnailUrl) {
    return (
      <div className='flex h-full w-full items-center justify-center bg-muted/50 dark:bg-muted/30'>
        <div className='flex flex-col items-center justify-center space-y-1 p-2 text-center'>
          <ImageOff className='h-4 w-4 text-muted-foreground/70 dark:text-slate-400/70' />
          <span className='text-xs text-muted-foreground/70 dark:text-slate-400/70'>
            No image
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      className='relative h-full w-full bg-muted dark:bg-muted/80 group'
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <ZoomableImage src={thumbnailUrl} alt={`Cover of ${title}`}>
        <ViewTransition name='book-cover-image'>
          <Image
            src={thumbnailUrl}
            alt={`Cover of ${title}`}
            fill
            className={cn(
              'object-cover transition-opacity duration-300',
              isLoading ? 'opacity-0' : 'opacity-100',
              hasError ? 'hidden' : 'block'
            )}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false)
              setHasError(true)
            }}
          />
        </ViewTransition>
      </ZoomableImage>

      {/* Hover overlay with like button */}
      <div
        className={cn(
          'absolute inset-0 bg-black/40 transition-opacity duration-200',
          isHovering ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        <Suspense fallback={null}>
          <Protect>
            <LikeButton bookEditionId={bookEditionId} isHovering={isHovering} />
          </Protect>
        </Suspense>
      </div>

      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center bg-muted/50 dark:bg-muted/30'>
          <Loader2 className='h-4 w-4 animate-spin text-muted-foreground/70 dark:text-slate-400/70' />
        </div>
      )}

      {hasError && (
        <div className='flex h-full w-full items-center justify-center bg-muted/50 dark:bg-muted/30'>
          <div className='flex flex-col items-center justify-center space-y-1 p-2 text-center'>
            <ImageOff className='h-4 w-4 text-muted-foreground/70 dark:text-slate-400/70' />
            <span className='text-xs text-muted-foreground/70 dark:text-slate-400/70'>
              Failed to load
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
