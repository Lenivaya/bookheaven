'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface AvatarImageProps {
  src: string
  alt: string
  size?: number
  className?: string
}

export function OptimizedAvatarImage({
  src,
  alt,
  size = 48,
  className
}: AvatarImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {!hasError ? (
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className={cn(
            'object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          quality={70}
          loading='lazy'
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setHasError(true)
          }}
        />
      ) : (
        <div className='flex h-full w-full items-center justify-center bg-muted'>
          <span className='text-xs text-muted-foreground'>{alt.charAt(0)}</span>
        </div>
      )}
    </div>
  )
}
