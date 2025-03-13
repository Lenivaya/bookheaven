import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { BookOpenIcon } from 'lucide-react'

export default function BookShelfLoading() {
  return (
    <div className='container py-8 max-w-6xl mx-auto'>
      {/* Header section with shelf info */}
      <div className='mb-8 space-y-6 mt-25'>
        <div className='flex justify-between items-start gap-4 flex-wrap'>
          <div className='space-y-2 flex-1 min-w-[280px]'>
            <Skeleton className='h-9 w-2/3' /> {/* Shelf name */}
            <Skeleton className='h-5 w-full max-w-xl' /> {/* Description */}
            <div className='flex flex-wrap items-center gap-2 mt-3'>
              <Skeleton className='h-5 w-24' /> {/* Books count badge */}
              <Skeleton className='h-5 w-20' /> {/* Privacy badge */}
            </div>
          </div>

          <div className='flex gap-2'>
            <Skeleton className='h-10 w-10' /> {/* Edit button */}
            <Skeleton className='h-10 w-24' /> {/* Like button */}
          </div>
        </div>

        {/* User info skeleton */}
        <div className='flex items-center gap-3'>
          <Skeleton className='h-8 w-8 rounded-full' /> {/* User avatar */}
          <div className='space-y-1'>
            <Skeleton className='h-4 w-32' /> {/* Username */}
            <Skeleton className='h-3 w-24' /> {/* Created date */}
          </div>
        </div>

        <Separator />
      </div>

      {/* Books grid section */}
      <div className='space-y-6'>
        <Skeleton className='h-7 w-40' /> {/* Section title */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'>
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className='flex flex-col h-full'>
              <div className='relative aspect-[2/3] w-full overflow-hidden rounded-md shadow-sm mb-3 bg-muted/50'>
                <div className='flex h-full w-full items-center justify-center'>
                  <BookOpenIcon className='h-12 w-12 text-muted-foreground' />
                </div>
              </div>

              <div className='flex-1 space-y-1'>
                <Skeleton className='h-5 w-full' /> {/* Book title */}
                <Skeleton className='h-4 w-4/5' /> {/* Author name */}
                <Skeleton className='h-3 w-2/3' /> {/* Publisher */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
