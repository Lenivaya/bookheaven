import { Link } from 'next-view-transitions'
import { Button } from '@/components/ui/button'
import { UserIcon } from 'lucide-react'

export default function AuthorsNotFound() {
  return (
    <div className='container mx-auto py-8 mt-20'>
      <div className='flex flex-col items-center justify-center min-h-[50vh] text-center'>
        <div className='rounded-full bg-muted p-6 mb-4'>
          <UserIcon className='h-12 w-12 text-muted-foreground' />
        </div>
        <h2 className='text-3xl font-bold mb-2'>Author Not Found</h2>
        <p className='text-muted-foreground mb-6 max-w-md'>
          We couldn&apos;t find the author you&apos;re looking for. They might
          have been removed or never existed.
        </p>
        <div className='flex gap-4'>
          <Button asChild>
            <Link href='/authors'>Browse Authors</Link>
          </Button>
          <Button variant='outline' asChild>
            <Link href='/'>Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
