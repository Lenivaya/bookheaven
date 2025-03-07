'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Tag, TagsIcon } from 'lucide-react'

interface BookPriceDisplayProps {
  price: string
  salePrice: string | null
  isOnSale: boolean
}

export function BookPriceDisplay({
  price,
  salePrice,
  isOnSale
}: BookPriceDisplayProps) {
  const [isHighlighted, setIsHighlighted] = useState(false)

  // Highlight the sale price briefly when component mounts
  useEffect(() => {
    if (isOnSale && salePrice) {
      setIsHighlighted(true)
      const timer = setTimeout(() => setIsHighlighted(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isOnSale, salePrice])

  if (isOnSale && salePrice) {
    return (
      <div className='flex items-center gap-1.5 relative'>
        <div
          className={cn(
            'flex items-center px-1.5 py-0.5 rounded-md bg-destructive/10 dark:bg-destructive/20',
            isHighlighted &&
              'ring-1 ring-destructive/30 dark:ring-destructive/40'
          )}
        >
          <Tag className='h-3 w-3 mr-1 text-destructive/70 dark:text-red-400/80' />
          <span
            className={cn(
              'font-bold text-destructive text-sm dark:text-red-400',
              isHighlighted && 'animate-pulse'
            )}
          >
            ${salePrice}
          </span>
        </div>
        <span className='text-xs text-muted-foreground line-through dark:text-slate-500'>
          ${price}
        </span>
      </div>
    )
  }

  return (
    <div className='flex items-center px-1.5 py-0.5 rounded-md bg-primary/10 dark:bg-primary/20'>
      <TagsIcon className='h-3 w-3 mr-1 text-primary/70 dark:text-primary/80' />
      <span className='font-bold text-primary text-sm dark:text-primary-foreground/90'>
        ${price}
      </span>
    </div>
  )
}
