'use client'

import { ZoomableImage } from '@/components/generic/ZoomableImage'
import { cn } from '@/lib/utils'
import { Protect } from '@clerk/nextjs'
import { ImageOff, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { Suspense, useState } from 'react'
import { LikeButton } from './LikeButton'

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
        <Image
          src={thumbnailUrl}
          alt={`Cover of ${title}`}
          fill
          className={cn(
            'object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            hasError ? 'hidden' : 'block'
          )}
          sizes='(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 20vw'
          quality={80}
          loading='lazy'
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setHasError(true)
          }}
        />
      </ZoomableImage>

      {/* Hover overlay with like button */}
      <div className='absolute inset-0 bg-black/40' />
      <Suspense fallback={null}>
        <Protect>
          <LikeButton bookEditionId={bookEditionId} isHovering={isHovering} />
        </Protect>
      </Suspense>

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
