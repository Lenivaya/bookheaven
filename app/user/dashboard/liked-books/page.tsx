import { Separator } from '@/components/ui/separator'

export default function LikedBooksPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight'>Liked Books</h2>
        <p className='text-muted-foreground'>
          Books you&apos;ve liked across the platform.
        </p>
      </div>

      <Separator />

      <div className='rounded-lg border bg-card text-card-foreground shadow-sm'>
        <div className='p-6 text-center text-muted-foreground'>
          You haven&apos;t liked any books yet.
        </div>
      </div>
    </div>
  )
}
