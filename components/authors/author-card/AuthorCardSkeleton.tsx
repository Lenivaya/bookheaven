import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function AuthorCardSkeleton() {
  return (
    <Card className='h-full overflow-hidden border-border/40 bg-card/95'>
      <CardHeader className='flex flex-row items-center gap-4 p-4'>
        <Skeleton className='h-16 w-16 rounded-full' />

        <div className='flex flex-col space-y-2 flex-1'>
          <Skeleton className='h-5 w-3/4' />
          <Skeleton className='h-4 w-1/2' />
        </div>
      </CardHeader>

      <CardContent className='px-4 pb-2'>
        <Skeleton className='h-4 w-full mb-2' />
        <Skeleton className='h-4 w-5/6' />
        <Skeleton className='h-4 w-4/6 mt-2' />
      </CardContent>

      <CardFooter className='flex justify-between p-4 pt-2'>
        <div className='flex gap-2'>
          <Skeleton className='h-9 w-24 rounded-md' />
          <Skeleton className='h-9 w-20 rounded-md' />
        </div>

        <Skeleton className='h-9 w-16 rounded-md' />
      </CardFooter>
    </Card>
  )
}
