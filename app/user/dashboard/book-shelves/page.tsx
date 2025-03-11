import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PlusIcon } from 'lucide-react'

export default function BookShelvesPage() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-semibold tracking-tight'>
            Book Shelves
          </h2>
          <p className='text-muted-foreground'>
            Create and manage your custom book collections.
          </p>
        </div>

        <Button size='sm' className='gap-1'>
          <PlusIcon className='h-4 w-4' />
          <span>New Shelf</span>
        </Button>
      </div>

      <Separator />

      <div className='rounded-lg border bg-card text-card-foreground shadow-sm'>
        <div className='p-6 text-center text-muted-foreground'>
          You haven&apos;t created any book shelves yet.
        </div>
      </div>
    </div>
  )
}
