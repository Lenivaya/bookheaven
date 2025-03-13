import { getBooks } from '@/app/actions/books.actions'
import BookCard from '@/components/books/book-card/BookCard'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { FocusCards } from '@/components/ui/focus-cards'
import {
  ArrowRight,
  BookOpen,
  Heart,
  ShoppingBag,
  Star,
  TrendingUp,
  Mail,
  BookMarked,
  BookText,
  BookCopy
} from 'lucide-react'
import { Link } from 'next-view-transitions'
import { getPopularTags } from './actions/tags.actions'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

export default async function Home() {
  const [featuredBooks, popularTags] = await Promise.all([
    getBooks({
      limit: 6,
      offset: 0
    }),
    getPopularTags({ limit: 9 })
  ])

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

  return (
    <div className='flex flex-col min-h-screen'>
      {/* Hero Section */}
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
              <div className='inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-sm font-medium text-primary mb-4 animate-fade-in backdrop-blur-sm'>
                <span className='mr-1'>✨</span> Your Literary Journey Begins
                Here
              </div>
              <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 animate-fade-in-up'>
                Discover Your Next Favorite Book
              </h1>
              <p className='text-muted-foreground md:text-xl mt-4 animate-fade-in-up animation-delay-100'>
                BookHeaven is your personal library in the cloud. Buy, collect,
                and track your favorite books all in one place.
              </p>
            </div>
            <div className='flex flex-col gap-2 min-[400px]:flex-row mt-8 animate-fade-in-up animation-delay-200'>
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

      {/* Features Section */}
      <section className='w-full py-12 md:py-24 lg:py-32 bg-background'>
        <div className='container mx-auto px-4 md:px-6 max-w-6xl'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center'>
            <div className='space-y-2'>
              <div className='inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary'>
                Features
              </div>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80'>
                Everything You Need for Your Reading Journey
              </h2>
              <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                BookHeaven provides a seamless experience for book lovers to
                discover, purchase, and organize their collection.
              </p>
            </div>
          </div>
          <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3'>
            <Card className='relative overflow-hidden border-none shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] duration-300 group'>
              <div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 z-0 group-hover:from-primary/30 transition-all duration-300' />
              <CardContent className='p-6 z-10 relative'>
                <div className='rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-300'>
                  <BookOpen className='h-6 w-6 text-primary' />
                </div>
                <h3 className='text-xl font-bold mb-2'>Extensive Library</h3>
                <p className='text-muted-foreground'>
                  Access thousands of books across all genres, from bestsellers
                  to hidden gems.
                </p>
              </CardContent>
            </Card>
            <Card className='relative overflow-hidden border-none shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] duration-300 group'>
              <div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 z-0 group-hover:from-primary/30 transition-all duration-300' />
              <CardContent className='p-6 z-10 relative'>
                <div className='rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-300'>
                  <Heart className='h-6 w-6 text-primary' />
                </div>
                <h3 className='text-xl font-bold mb-2'>Track Favorites</h3>
                <p className='text-muted-foreground'>
                  Create collections and track your reading progress across
                  devices.
                </p>
              </CardContent>
            </Card>
            <Card className='relative overflow-hidden border-none shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] duration-300 group'>
              <div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 z-0 group-hover:from-primary/30 transition-all duration-300' />
              <CardContent className='p-6 z-10 relative'>
                <div className='rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-300'>
                  <ShoppingBag className='h-6 w-6 text-primary' />
                </div>
                <h3 className='text-xl font-bold mb-2'>Easy Purchasing</h3>
                <p className='text-muted-foreground'>
                  Buy books with just a few clicks and start reading instantly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className='w-full py-12 md:py-24 lg:py-32 bg-muted/50 relative overflow-hidden'>
        <div className='absolute inset-0 bg-[url("/book-pattern.svg")] bg-repeat opacity-5' />
        <div className='container mx-auto px-4 md:px-6 relative'>
          <div className='flex flex-col items-center justify-center space-y-6 text-center mb-8'>
            <div className='space-y-3'>
              <div className='inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary'>
                Featured Collection
              </div>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80'>
                Featured Books
              </h2>
              <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-xl/relaxed'>
                Discover our handpicked selection of must-read books this
                season.
              </p>
            </div>
          </div>
          <div className='py-8 px-4'>
            <Carousel
              className='w-full mx-auto'
              opts={{
                align: 'center',
                loop: true,
                slidesToScroll: 1,
                containScroll: 'trimSnaps'
              }}
            >
              <CarouselContent className='-ml-4 md:-ml-6'>
                {featuredBooks.books.map((book) => (
                  <CarouselItem
                    key={book.edition.id}
                    className='pl-4 md:pl-6 sm:basis-1/2 md:basis-1/3 py-4'
                  >
                    <div className='h-full transform transition-all duration-300 hover:scale-[1.03] hover:rotate-1 flex justify-center'>
                      <div className='w-full'>
                        <BookCard
                          book={book.work}
                          edition={book.edition}
                          authors={book.authors}
                          tags={book.tags}
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className='left-2 md:left-4 lg:left-8 opacity-70 hover:opacity-100' />
              <CarouselNext className='right-2 md:right-4 lg:right-8 opacity-70 hover:opacity-100' />
            </Carousel>
          </div>
          <div className='flex justify-center mt-10'>
            <Link href='/books'>
              <Button
                variant='outline'
                size='lg'
                className='gap-1.5 border-primary/20 hover:bg-primary/5 transition-all duration-300'
              >
                View All Books
                <ArrowRight className='h-4 w-4' />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Now Section */}
      <section className='w-full py-12 md:py-24 lg:py-32 bg-background'>
        <div className='container mx-auto px-4 md:px-6 max-w-6xl'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center'>
            <div className='space-y-2'>
              <div className='inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary'>
                <TrendingUp className='h-4 w-4 mr-1' /> Trending Now
              </div>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80'>
                What's Hot Right Now
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

      {/* Newsletter Section */}
      <section className='w-full py-12 md:py-24 bg-muted/50 relative overflow-hidden'>
        <div className='absolute inset-0 bg-[url("/book-pattern.svg")] bg-repeat opacity-5' />
        <div className='container mx-auto px-4 md:px-6 max-w-6xl relative'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-8 bg-card rounded-xl p-8 shadow-lg border border-primary/10 backdrop-blur-sm'>
            <div className='flex flex-col space-y-4 text-left md:max-w-md'>
              <div className='inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary w-fit'>
                Newsletter
              </div>
              <h2 className='text-2xl md:text-3xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80'>
                Stay Updated with BookHeaven
              </h2>
              <p className='text-muted-foreground'>
                Subscribe to our newsletter for the latest book recommendations,
                exclusive offers, and literary insights delivered to your inbox.
              </p>
            </div>
            <div className='flex flex-col sm:flex-row gap-2 w-full md:max-w-md'>
              <Input
                type='email'
                placeholder='Enter your email'
                className='flex-1 bg-background/50 border-primary/20 focus-visible:ring-primary'
              />
              <Button
                size='lg'
                className='gap-1.5 bg-primary hover:bg-primary/90 shadow-md'
              >
                Subscribe
                <Mail className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
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
          <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3'>
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className='relative overflow-hidden border-none shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] duration-300 group'
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
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className='object-cover'
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

      {/* CTA Section */}
      <section className='w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground relative overflow-hidden'>
        <div className='absolute inset-0 bg-[url("/grid.svg")] bg-center opacity-10' />

        {/* Subtle floating book elements in CTA */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute top-1/4 left-[5%] opacity-10 animate-float-slow'>
            <BookMarked
              size={100}
              className='text-primary-foreground/30 rotate-12'
            />
          </div>
          <div className='absolute bottom-1/4 right-[5%] opacity-10 animate-float-medium'>
            <BookOpen
              size={80}
              className='text-primary-foreground/30 -rotate-6'
            />
          </div>
        </div>

        <div className='container mx-auto px-4 md:px-6 max-w-6xl relative'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center'>
            <div className='space-y-2'>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                Start Your Reading Journey Today
              </h2>
              <p className='max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                Join BookHeaven and discover your next favorite book. Browse our
                extensive collection and start building your personal library.
              </p>
            </div>
            <div className='flex flex-col gap-2 min-[400px]:flex-row mt-6'>
              <Link href='/books'>
                <Button
                  size='lg'
                  variant='secondary'
                  className='gap-1.5 shadow-lg hover:shadow-xl transition-all duration-300'
                >
                  Browse Books
                  <ArrowRight className='h-4 w-4' />
                </Button>
              </Link>
              <Button
                variant='outline'
                size='lg'
                className='bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300'
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
