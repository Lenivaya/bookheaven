import Link from 'next/link'
import { XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

export default function PaymentsCancel() {
  return (
    <div className='flex min-h-[calc(100vh-4rem)] items-center justify-center p-4'>
      <Card className='max-w-md w-full'>
        <CardHeader className='text-center'>
          <div className='flex justify-center mb-4'>
            <XCircle className='h-16 w-16 text-amber-500' />
          </div>
          <CardTitle className='text-2xl'>Payment Cancelled</CardTitle>
          <CardDescription>Your payment process was cancelled</CardDescription>
        </CardHeader>
        <CardContent className='text-center'>
          <p className='text-muted-foreground'>
            No worries! Your cart items are still saved. You can try again or
            continue browsing our collection of books.
          </p>
        </CardContent>
        <CardFooter className='flex flex-col sm:flex-row gap-3 justify-center'>
          <Button asChild variant='default'>
            <Link href='/cart'>Return to Cart</Link>
          </Button>
          <Button asChild variant='outline'>
            <Link href='/books'>Continue Shopping</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
