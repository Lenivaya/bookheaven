import { getBooks } from '@/app/actions/books.actions'
import BookCard from '@/components/books/book-card/BookCard'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { ArrowRight } from 'lucide-react'
import { Link } from 'next-view-transitions'

// This is a Server Component that fetches its own data
export default async function FeaturedBooksSection() {
  // Fetch data for this section independently
  const featuredBooks = await getBooks({
    limit: 6,
    offset: 0
  })

  return (
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
              Discover our handpicked selection of must-read books this season.
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
  )
}
