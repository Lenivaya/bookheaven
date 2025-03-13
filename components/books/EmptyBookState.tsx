import { LightbulbIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface EmptyBookStateProps {
  title?: string
  message?: string
  icon?: React.ReactNode
  className?: string
  minHeight?: string
  children?: ReactNode
}

/**
 * A reusable component for displaying when no books are found
 */
export function EmptyBookState({
  title = 'No books found',
  message = "Try adjusting your search or filter to find what you're looking for.",
  icon = <LightbulbIcon className='h-12 w-12 text-muted-foreground' />,
  className,
  minHeight = 'min-h-[70vh]',
  children
}: EmptyBookStateProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center py-16',
        minHeight,
        className
      )}
    >
      <div className='rounded-lg border border-dashed p-8 text-center max-w-md mx-auto'>
        <div className='flex justify-center'>{icon}</div>
        <h3 className='mt-4 text-lg font-semibold'>{title}</h3>
        <p className='mt-2 text-sm text-muted-foreground'>{message}</p>
        {children && <div className='mt-6'>{children}</div>}
      </div>
    </div>
  )
}
