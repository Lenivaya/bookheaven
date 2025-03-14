import { Suspense } from 'react'

// Static sections
import HeroSection from '@/app/sections/HeroSection'
import FeaturesSection from '@/app/sections/FeaturesSection'
import NewsletterSection from '@/app/sections/NewsletterSection'
import CTASection from '@/app/sections/CTASection'

// Dynamic sections with data fetching
import FeaturedBooksSection from '@/app/sections/FeaturedBooksSection'
import TrendingSection from '@/app/sections/TrendingSection'
import TestimonialsSection from '@/app/sections/TestimonialsSection'

// Skeleton loaders
import {
  FeaturedBooksSkeleton,
  TestimonialsSkeleton,
  TrendingSkeleton
} from './sections/SkeletonLoaders'

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between'>
      {/* Static sections that load immediately */}
      <HeroSection />
      <FeaturesSection />

      {/* Dynamic sections with suspense boundaries for parallel data fetching */}
      <Suspense fallback={<FeaturedBooksSkeleton />}>
        <FeaturedBooksSection />
      </Suspense>

      <Suspense fallback={<TrendingSkeleton />}>
        <TrendingSection />
      </Suspense>

      <TestimonialsSection />
      <NewsletterSection />
      <CTASection />
    </main>
  )
}
