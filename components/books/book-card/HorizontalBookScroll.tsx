import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HorizontalBookScrollProps {
  children: ReactNode
  className?: string
  title?: string
  showScrollButtons?: boolean
}

/**
 * A component for horizontal scrolling book lists
 */
export function HorizontalBookScroll({
  children,
  className,
  title,
  showScrollButtons = true
}: HorizontalBookScrollProps) {
  // Function to handle scrolling left
  const scrollLeft = () => {
    const container = document.getElementById('scroll-container')
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  // Function to handle scrolling right
  const scrollRight = () => {
    const container = document.getElementById('scroll-container')
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Title and scroll buttons */}
      {(title || showScrollButtons) && (
        <div className='flex items-center justify-between mb-4'>
          {title && (
            <h2 className='text-xl font-semibold tracking-tight'>{title}</h2>
          )}

          {showScrollButtons && (
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='icon'
                className='h-8 w-8 rounded-full'
                onClick={scrollLeft}
                aria-label='Scroll left'
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                className='h-8 w-8 rounded-full'
                onClick={scrollRight}
                aria-label='Scroll right'
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Scrollable container */}
      <div
        id='scroll-container'
        className='flex overflow-x-auto pb-4 gap-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/30 scroll-smooth'
      >
        {children}
      </div>
    </div>
  )
}
