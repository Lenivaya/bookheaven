'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { ZoomableImage } from '@/components/generic/ZoomableImage'

interface BookCoverProps {
  thumbnailUrl: string | null
  title: string
  className?: string
}

export default function BookCover({
  thumbnailUrl,
  title,
  className
}: BookCoverProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleImageError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  return (
    <div
      className={cn(
        'aspect-[2/3] bg-muted rounded-lg overflow-hidden shadow-md relative',
        className
      )}
    >
      {thumbnailUrl && !hasError ? (
        <>
          {isLoading && (
            <div className='absolute inset-0 flex items-center justify-center'>
              <Skeleton className='w-full h-full absolute' />
            </div>
          )}
          <ZoomableImage src={thumbnailUrl} alt={`Cover of ${title}`}>
            <Image
              src={thumbnailUrl}
              alt={`Cover of ${title}`}
              fill
              sizes='(max-width: 640px) 80vw, (max-width: 768px) 40vw, (max-width: 1024px) 30vw, 25vw'
              className={cn(
                'object-cover transition-opacity duration-300',
                isLoading ? 'opacity-0' : 'opacity-100'
              )}
              priority
              quality={85}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </ZoomableImage>
        </>
      ) : (
        <div className='w-full h-full flex items-center justify-center p-4 text-center'>
          <span className='text-lg font-medium text-muted-foreground'>
            {title}
          </span>
        </div>
      )}
    </div>
  )
}
