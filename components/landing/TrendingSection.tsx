import { getPopularTags } from '@/app/actions/tags.actions'
import { Button } from '@/components/ui/button'
import { FocusCards } from '@/components/ui/focus-cards'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { Link } from 'next-view-transitions'

// This is a Server Component that fetches its own data
export default async function TrendingSection() {
  // Fetch data for this section independently
  const popularTags = await getPopularTags({ limit: 9 })

  return (
    <section className='w-full py-12 md:py-24 lg:py-32 bg-background'>
      <div className='container mx-auto px-4 md:px-6 max-w-6xl'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <div className='inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary'>
              <TrendingUp className='h-4 w-4 mr-1' /> Trending Now
            </div>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80'>
              What&apos;s Hot Right Now
            </h2>
            <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
              Stay up to date with the most popular books our readers are
              loving.
            </p>
          </div>
        </div>
        <div className='mx-auto py-12'>
          <FocusCards
            cards={popularTags.map((tag) => ({
              title: tag.name,
              src: tag.coverUrl ?? '',
              id: tag.id
            }))}
          />
        </div>
        <div className='flex justify-center mt-8'>
          <Link href='/books'>
            <Button
              variant='outline'
              size='lg'
              className='gap-1.5 border-primary/20 hover:bg-primary/5 transition-all duration-300'
            >
              Browse All Categories
              <ArrowRight className='h-4 w-4' />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
