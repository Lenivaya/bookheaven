'use client'

import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  BookOpen,
  BookMarked,
  BookText,
  BookCopy
} from 'lucide-react'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className='relative w-full py-24 md:py-36 overflow-hidden'>
      {/* Animated background pattern */}
      <div className='absolute inset-0 bg-[url("/grid.svg")] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]' />
      <div className='absolute inset-0 bg-gradient-to-b from-primary/5 via-background/80 to-background' />

      {/* Floating book elements with enhanced animation */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-10 right-[10%] opacity-20 animate-float-slow'>
          <BookMarked size={120} className='text-primary/40 rotate-6' />
        </div>
        <div className='absolute top-1/3 left-[5%] opacity-20 animate-float-medium'>
          <BookText size={80} className='text-primary/40 -rotate-12' />
        </div>
        <div className='absolute bottom-1/4 right-[15%] opacity-20 animate-float-fast'>
          <BookOpen size={100} className='text-primary/40 rotate-3' />
        </div>
        <div className='absolute top-1/4 right-[30%] opacity-15 animate-float-medium'>
          <BookCopy size={90} className='text-primary/40 -rotate-6' />
        </div>
        <div className='absolute bottom-1/3 left-[15%] opacity-15 animate-float-slow'>
          <BookOpen size={70} className='text-primary/40 rotate-12' />
        </div>
      </div>

      <div className='container mx-auto px-4 md:px-6 max-w-6xl relative'>
        <div className='flex flex-col items-center text-center'>
          <div className='space-y-2 max-w-3xl mx-auto mt-10'>
            <div className='inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-sm font-medium text-primary mb-4 backdrop-blur-sm'>
              <span className='mr-1'>✨</span> Your Literary Journey Begins Here
            </div>
            <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60'>
              Discover Your Next Favorite Book
            </h1>
            <p className='text-muted-foreground md:text-xl mt-4'>
              BookHeaven is your personal library in the cloud. Buy, collect,
              and track your favorite books all in one place.
            </p>
          </div>
          <div className='flex flex-col gap-2 min-[400px]:flex-row mt-8'>
            <Link href='/books'>
              <Button
                size='lg'
                className='gap-1.5 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300'
              >
                Browse Books
                <ArrowRight className='h-4 w-4' />
              </Button>
            </Link>
            <Button
              variant='outline'
              size='lg'
              className='border-primary/20 hover:bg-primary/5 transition-all duration-300'
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
