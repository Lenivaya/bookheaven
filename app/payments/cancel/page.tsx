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
import { retrieveCheckoutSession } from '@/app/actions/payments.actions'
import { CopyableText } from '@/components/ui/copyable-text'
import { Separator } from '@/components/ui/separator'

export default async function PaymentsCancel({
  searchParams
}: {
  searchParams: { session_id?: string }
}) {
  const sessionId = searchParams.session_id
  const session = sessionId ? await retrieveCheckoutSession(sessionId) : null

  return (
    <div className='min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-black to-zinc-950'>
      <Card className='w-full max-w-xl border-zinc-800/50 bg-black/95 backdrop-blur-sm shadow-2xl'>
        <CardHeader className='text-center pb-8 pt-12 space-y-6'>
          <div className='flex justify-center'>
            <div className='rounded-full bg-amber-500/10 p-4 ring-4 ring-amber-500/20'>
              <XCircle className='h-12 w-12 text-amber-500' />
            </div>
          </div>
          <div className='space-y-2'>
            <CardTitle className='text-3xl font-semibold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent'>
              Payment Cancelled
            </CardTitle>
            <CardDescription className='text-zinc-400 text-lg'>
              Your payment process was cancelled
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className='space-y-8 px-6 sm:px-8'>
          <p className='text-zinc-400 text-center text-base leading-relaxed max-w-md mx-auto'>
            No worries! Your cart items are still saved. You can try again or
            continue browsing our collection of books.
          </p>

          {session && (
            <>
              <Separator className='bg-zinc-800/50' />
              <div className='bg-zinc-950/50 rounded-lg p-4 border border-zinc-800/50'>
                <div className='flex items-center justify-between'>
                  <span className='text-zinc-400 font-medium'>Session ID:</span>
                  <CopyableText
                    text={session.id}
                    displayText={session.id.substring(0, 20) + '...'}
                    className='font-mono text-xs text-zinc-300 hover:text-zinc-100 transition-colors'
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className='flex flex-col gap-3 px-6 sm:px-8 pb-8 pt-6'>
          <Button
            asChild
            className='w-full bg-gradient-to-br from-amber-200 to-amber-100 text-black hover:from-amber-100 hover:to-amber-50 h-12 font-medium shadow-lg shadow-amber-950/10 transition-all duration-300'
          >
            <Link href='/cart'>Return to Cart</Link>
          </Button>
          <Button
            variant='outline'
            asChild
            className='w-full border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 h-12 transition-all duration-300'
          >
            <Link href='/books'>Continue Shopping</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
