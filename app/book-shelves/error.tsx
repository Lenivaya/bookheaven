'use client'

import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { useEffect } from 'react'

export default function BooksError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className='container mx-auto py-8 mt-20'>
      <div className='flex flex-col items-center justify-center min-h-[50vh] text-center'>
        <div className='rounded-full bg-destructive/10 p-4 mb-4'>
          <AlertCircle className='h-8 w-8 text-destructive' />
        </div>
        <h2 className='text-2xl font-bold mb-2'>Something went wrong!</h2>
        <p className='text-muted-foreground mb-6 max-w-md'>
          We encountered an error while trying to load the books shelves. Please
          try again or contact support if the problem persists.
        </p>
        <Button onClick={reset} variant='default'>
          Try again
        </Button>
      </div>
    </div>
  )
}
