import { getBooks } from '@/app/actions/books.actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BookCard from '@/components/books/book-card/BookCard'
import { ArrowRight, BookOpen, Heart, ShoppingBag, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default async function Home() {
  // Fetch featured books for the carousel
  const featuredBooks = await getBooks({
    limit: 6,
    offset: 0
  })

  return (
    <div className='flex flex-col min-h-screen'>
      {/* Hero Section */}
      <section className='relative w-full py-24 md:py-32 overflow-hidden bg-gradient-to-b from-primary/5 to-background'>
        <div className='container mx-auto px-4 md:px-6 max-w-6xl'>
          <div className='flex flex-col items-center text-center'>
            <div className='space-y-2 max-w-3xl mx-auto'>
              <h1 className='text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none'>
                Discover Your Next Favorite Book
              </h1>
              <p className='text-muted-foreground md:text-xl'>
                BookHeaven is your personal library in the cloud. Buy, collect,
                and track your favorite books all in one place.
              </p>
            </div>
            <div className='flex flex-col gap-2 min-[400px]:flex-row mt-6'>
              <Link href='/books'>
                <Button size='lg' className='gap-1.5'>
                  Browse Books
                  <ArrowRight className='h-4 w-4' />
                </Button>
              </Link>
              <Button variant='outline' size='lg'>
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
              <div className='inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm'>
                Features
              </div>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                Everything You Need for Your Reading Journey
              </h2>
              <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                BookHeaven provides a seamless experience for book lovers to
                discover, purchase, and organize their collection.
              </p>
            </div>
          </div>
          <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3'>
            <Card className='relative overflow-hidden border-none shadow-lg transition-all hover:shadow-xl'>
              <div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 z-0' />
              <CardContent className='p-6 z-10 relative'>
                <BookOpen className='h-10 w-10 mb-4 text-primary' />
                <h3 className='text-xl font-bold'>Extensive Library</h3>
                <p className='text-muted-foreground'>
                  Access thousands of books across all genres, from bestsellers
                  to hidden gems.
                </p>
              </CardContent>
            </Card>
            <Card className='relative overflow-hidden border-none shadow-lg transition-all hover:shadow-xl'>
              <div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 z-0' />
              <CardContent className='p-6 z-10 relative'>
                <Heart className='h-10 w-10 mb-4 text-primary' />
                <h3 className='text-xl font-bold'>Track Favorites</h3>
                <p className='text-muted-foreground'>
                  Create collections and track your reading progress across
                  devices.
                </p>
              </CardContent>
            </Card>
            <Card className='relative overflow-hidden border-none shadow-lg transition-all hover:shadow-xl'>
              <div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 z-0' />
              <CardContent className='p-6 z-10 relative'>
                <ShoppingBag className='h-10 w-10 mb-4 text-primary' />
                <h3 className='text-xl font-bold'>Easy Purchasing</h3>
                <p className='text-muted-foreground'>
                  Buy books with just a few clicks and start reading instantly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className='w-full py-12 md:py-24 bg-muted/50'>
        <div className='container mx-auto px-4 md:px-6 max-w-6xl'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center'>
            <div className='space-y-2'>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                Featured Books
              </h2>
              <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                Discover our handpicked selection of must-read books this
                season.
              </p>
            </div>
          </div>
          <div className='py-8'>
            <Carousel className='w-full max-w-5xl mx-auto'>
              <CarouselContent>
                {featuredBooks.map((book) => (
                  <CarouselItem
                    key={book.edition.id}
                    className='md:basis-1/2 lg:basis-1/3'
                  >
                    <div className='p-1'>
                      <BookCard
                        book={book.work}
                        edition={book.edition}
                        authors={book.authors}
                        tags={book.tags}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className='left-0' />
              <CarouselNext className='right-0' />
            </Carousel>
          </div>
          <div className='flex justify-center mt-8'>
            <Link href='/books'>
              <Button variant='outline' size='lg' className='gap-1.5'>
                View All Books
                <ArrowRight className='h-4 w-4' />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className='w-full py-12 md:py-24 lg:py-32 bg-background'>
        <div className='container mx-auto px-4 md:px-6 max-w-6xl'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center'>
            <div className='space-y-2'>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                Explore Categories
              </h2>
              <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                Find your next read by browsing our curated categories.
              </p>
            </div>
          </div>
          <div className='mx-auto py-8'>
            <Tabs defaultValue='fiction' className='w-full max-w-4xl mx-auto'>
              <TabsList className='grid w-full grid-cols-4'>
                <TabsTrigger value='fiction'>Fiction</TabsTrigger>
                <TabsTrigger value='non-fiction'>Non-Fiction</TabsTrigger>
                <TabsTrigger value='sci-fi'>Sci-Fi & Fantasy</TabsTrigger>
                <TabsTrigger value='mystery'>Mystery & Thriller</TabsTrigger>
              </TabsList>
              <TabsContent value='fiction' className='mt-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {featuredBooks.slice(0, 3).map((book) => (
                    <Card key={book.edition.id} className='overflow-hidden'>
                      <div className='aspect-[3/4] relative'>
                        <Image
                          src={
                            book.edition.thumbnailUrl ||
                            'https://placehold.co/400x600?text=No+Cover'
                          }
                          alt={book.work.title}
                          fill
                          className='object-cover'
                        />
                      </div>
                      <CardContent className='p-4'>
                        <h3 className='font-semibold truncate'>
                          {book.work.title}
                        </h3>
                        <p className='text-sm text-muted-foreground truncate'>
                          {book.authors.map((a) => a.name).join(', ')}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value='non-fiction' className='mt-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {featuredBooks.slice(2, 5).map((book) => (
                    <Card key={book.edition.id} className='overflow-hidden'>
                      <div className='aspect-[3/4] relative'>
                        <Image
                          src={
                            book.edition.thumbnailUrl ||
                            'https://placehold.co/400x600?text=No+Cover'
                          }
                          alt={book.work.title}
                          fill
                          className='object-cover'
                        />
                      </div>
                      <CardContent className='p-4'>
                        <h3 className='font-semibold truncate'>
                          {book.work.title}
                        </h3>
                        <p className='text-sm text-muted-foreground truncate'>
                          {book.authors.map((a) => a.name).join(', ')}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value='sci-fi' className='mt-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {featuredBooks.slice(1, 4).map((book) => (
                    <Card key={book.edition.id} className='overflow-hidden'>
                      <div className='aspect-[3/4] relative'>
                        <Image
                          src={
                            book.edition.thumbnailUrl ||
                            'https://placehold.co/400x600?text=No+Cover'
                          }
                          alt={book.work.title}
                          fill
                          className='object-cover'
                        />
                      </div>
                      <CardContent className='p-4'>
                        <h3 className='font-semibold truncate'>
                          {book.work.title}
                        </h3>
                        <p className='text-sm text-muted-foreground truncate'>
                          {book.authors.map((a) => a.name).join(', ')}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value='mystery' className='mt-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {featuredBooks.slice(3, 6).map((book) => (
                    <Card key={book.edition.id} className='overflow-hidden'>
                      <div className='aspect-[3/4] relative'>
                        <Image
                          src={
                            book.edition.thumbnailUrl ||
                            'https://placehold.co/400x600?text=No+Cover'
                          }
                          alt={book.work.title}
                          fill
                          className='object-cover'
                        />
                      </div>
                      <CardContent className='p-4'>
                        <h3 className='font-semibold truncate'>
                          {book.work.title}
                        </h3>
                        <p className='text-sm text-muted-foreground truncate'>
                          {book.authors.map((a) => a.name).join(', ')}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='w-full py-12 md:py-24 bg-muted'>
        <div className='container mx-auto px-4 md:px-6 max-w-6xl'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center'>
            <div className='space-y-2'>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                What Our Readers Say
              </h2>
              <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                Join thousands of satisfied readers who have found their perfect
                books with BookHeaven.
              </p>
            </div>
          </div>
          <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3'>
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className='relative overflow-hidden border-none shadow-lg'
              >
                <div className='absolute inset-0 bg-gradient-to-br from-primary/10 to-background z-0' />
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
                  <p className='mb-4 italic'>
                    &ldquo;BookHeaven has completely transformed how I discover
                    and enjoy books. The recommendations are spot-on!&rdquo;
                  </p>
                  <div className='flex items-center'>
                    <div className='h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3'>
                      <span className='font-semibold text-primary'>
                        {String.fromCharCode(65 + i)}
                      </span>
                    </div>
                    <div>
                      <h4 className='font-semibold'>Reader {i}</h4>
                      <p className='text-sm text-muted-foreground'>
                        Book Enthusiast
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
      <section className='w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground'>
        <div className='container mx-auto px-4 md:px-6 max-w-6xl'>
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
                <Button size='lg' variant='secondary' className='gap-1.5'>
                  Browse Books
                  <ArrowRight className='h-4 w-4' />
                </Button>
              </Link>
              <Button
                variant='outline'
                size='lg'
                className='bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10'
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
