import { Separator } from '@/components/ui/separator'

export default function ReviewsPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight'>Reviews</h2>
        <p className='text-muted-foreground'>Your book reviews and ratings.</p>
      </div>

      <Separator />

      <div className='rounded-lg border bg-card text-card-foreground shadow-sm'>
        <div className='p-6 text-center text-muted-foreground'>
          You haven&apos;t written any reviews yet.
        </div>
      </div>
    </div>
  )
}
