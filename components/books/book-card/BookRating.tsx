'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { useState, useEffect } from 'react'

interface BookRatingProps {
  rating?: number | null
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onRatingChange?: (rating: number) => void
  isLoading?: boolean
}

export function BookRating({
  rating = 0,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  isLoading = false
}: BookRatingProps) {
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1)
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)

  // Reset hovered rating when actual rating changes
  useEffect(() => {
    setHoveredRating(null)
  }, [rating])

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  const handleClick = (newRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(newRating)
    }
  }

  if (isLoading) {
    return (
      <div className='flex items-center gap-1'>
        {stars.map((_, index) => (
          <Skeleton
            key={index}
            className={cn(sizeClasses[size], 'rounded-full')}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className='flex items-center'
      onMouseLeave={() => interactive && setHoveredRating(null)}
    >
      {stars.map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            'transition-colors',
            hoveredRating !== null && interactive
              ? star <= hoveredRating
                ? 'fill-amber-400 text-amber-400'
                : 'text-muted-foreground'
              : star <= (rating || 0)
                ? 'fill-amber-400 text-amber-400'
                : 'text-muted-foreground',
            interactive && 'cursor-pointer'
          )}
          onClick={() => interactive && handleClick(star)}
          onMouseEnter={() => interactive && setHoveredRating(star)}
        />
      ))}
    </div>
  )
}
