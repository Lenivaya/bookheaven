'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

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
      <div className='flex items-center gap-1'>
        <span
          className={cn(
            'font-medium text-destructive text-[11px] dark:text-red-400',
            isHighlighted && 'animate-pulse'
          )}
        >
          ${salePrice}
        </span>
        <span className='text-[9px] text-muted-foreground line-through dark:text-slate-500'>
          ${price}
        </span>
      </div>
    )
  }

  return (
    <span className='font-medium text-foreground text-[11px] dark:text-slate-200'>
      ${price}
    </span>
  )
}
