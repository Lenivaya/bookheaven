import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

export default function PaymentsSuccess() {
  return (
    <div className='flex min-h-[calc(100vh-4rem)] items-center justify-center p-4'>
      <Card className='max-w-md w-full'>
        <CardHeader className='text-center'>
          <div className='flex justify-center mb-4'>
            <CheckCircle2 className='h-16 w-16 text-green-500' />
          </div>
          <CardTitle className='text-2xl'>Payment Successful!</CardTitle>
          <CardDescription>
            Thank you for your purchase at BookHeaven
          </CardDescription>
        </CardHeader>
        <CardContent className='text-center'>
          <p className='text-muted-foreground'>
            Your order has been processed successfully. You will receive a
            confirmation email shortly with details of your purchase.
          </p>
        </CardContent>
        <CardFooter className='flex justify-center'>
          <Button asChild>
            <Link href='/books'>Continue Exploring Books</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
