import { Button } from '@/components/ui/button'
import { Link } from 'next-view-transitions'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className='w-full py-12 md:py-24 bg-primary text-primary-foreground'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
              Ready to Start Your Reading Journey?
            </h2>
            <p className='mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
              Join thousands of readers who have already discovered their next
              favorite book with BookHeaven.
            </p>
          </div>
          <div className='flex flex-col sm:flex-row gap-4 min-[400px]:gap-6'>
            <Link href='/books'>
              <Button
                size='lg'
                className='bg-background text-primary hover:bg-background/90'
              >
                Explore Books
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </Link>
            <Link href='/signup'>
              <Button
                size='lg'
                variant='outline'
                className='border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10'
              >
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
