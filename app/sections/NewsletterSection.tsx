import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail } from 'lucide-react'

export default function NewsletterSection() {
  return (
    <section className='w-full py-12 md:py-24 bg-primary/5'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <div className='inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary'>
              Newsletter
            </div>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
              Stay Updated with BookHeaven
            </h2>
            <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
              Subscribe to our newsletter for curated reading lists, author
              interviews, and exclusive discounts.
            </p>
          </div>
          <div className='w-full max-w-md space-y-2'>
            <form className='flex flex-col sm:flex-row gap-2'>
              <div className='relative flex-1'>
                <Mail className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  className='w-full pl-10'
                  placeholder='Enter your email'
                  type='email'
                  required
                />
              </div>
              <Button type='submit' className='sm:w-auto'>
                Subscribe
              </Button>
            </form>
            <p className='text-xs text-muted-foreground'>
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
