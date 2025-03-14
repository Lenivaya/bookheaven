'use client'

import { Card, CardContent } from '@/components/ui/card'
import { OptimizedAvatarImage } from '@/components/ui/avatar-image'
import { Star } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

// Testimonial data with realistic names and avatars
const testimonials = [
  {
    id: 1,
    name: 'Emily Johnson',
    role: 'Book Blogger',
    avatar: 'https://i.pravatar.cc/150?img=32',
    quote:
      'BookHeaven has completely transformed how I discover and enjoy books. The recommendations are spot-on and I love the clean interface!'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Literature Professor',
    avatar: 'https://i.pravatar.cc/150?img=69',
    quote:
      "As someone who reads professionally, I appreciate the curation and organization BookHeaven provides. It's become an essential tool in my daily life."
  },
  {
    id: 3,
    name: 'Sophia Rodriguez',
    role: 'Avid Reader',
    avatar: 'https://i.pravatar.cc/150?img=47',
    quote:
      "I've discovered so many hidden gems through BookHeaven that I would have never found otherwise. The user experience is simply delightful!"
  }
]

export default function TestimonialsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (inView) {
      setIsVisible(true)
    }
  }, [inView])

  return (
    <section className='w-full py-12 md:py-24 bg-background'>
      <div className='container mx-auto px-4 md:px-6 max-w-6xl'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <div className='inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary'>
              Testimonials
            </div>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80'>
              What Our Readers Say
            </h2>
            <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
              Join thousands of satisfied readers who have found their perfect
              books with BookHeaven.
            </p>
          </div>
        </div>
        <div
          ref={ref}
          className='mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3'
        >
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className={cn(
                'relative overflow-hidden border-none shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] duration-300 group opacity-0 translate-y-4',
                isVisible && 'opacity-100 translate-y-0'
              )}
              style={{
                transitionDelay: `${index * 0.1}s`,
                transitionProperty: 'all',
                transitionDuration: '0.5s'
              }}
            >
              <div className='absolute inset-0 bg-gradient-to-br from-primary/10 to-background z-0 group-hover:from-primary/20 transition-all duration-300' />
              <CardContent className='p-6 z-10 relative'>
                <div className='flex mb-4'>
                  {Array(5)
                    .fill(0)
                    .map((_, j) => (
                      <Star
                        key={j}
                        className='h-5 w-5 text-yellow-500 fill-yellow-500'
                      />
                    ))}
                </div>
                <p className='mb-6 italic text-muted-foreground'>
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className='flex items-center'>
                  <div className='h-12 w-12 rounded-full overflow-hidden mr-3 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300'>
                    <OptimizedAvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      size={48}
                    />
                  </div>
                  <div>
                    <h4 className='font-semibold'>{testimonial.name}</h4>
                    <p className='text-sm text-muted-foreground'>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
