import { Suspense } from 'react'

// Static sections
import CTASection from '@/app/sections/CTASection'
import FeaturesSection from '@/app/sections/FeaturesSection'
import HeroSection from '@/app/sections/HeroSection'
import NewsletterSection from '@/app/sections/NewsletterSection'

// Dynamic sections with data fetching
import FeaturedBooksSection from '@/app/sections/FeaturedBooksSection'
import TestimonialsSection from '@/app/sections/TestimonialsSection'
import TrendingSection from '@/app/sections/TrendingSection'

// Skeleton loaders
import {
  FeaturedBooksSkeleton,
  TrendingSkeleton
} from './sections/SkeletonLoaders'

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between'>
      {/* Static sections that load immediately */}
      <HeroSection />
      <FeaturesSection />

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
