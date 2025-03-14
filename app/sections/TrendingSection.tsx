import { getBooks } from '@/app/actions/books.actions'
import BookCard from '@/components/books/book-card/BookCard'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

// This is a Server Component that fetches its own data
export default async function TrendingSection() {
  // Fetch trending books - using different offset to get different books
  const trendingBooks = await getBooks({
    limit: 4,
    offset: 8 // Different offset to get different books than featured section
  })

  return (
    <section className='w-full py-12 md:py-24 bg-muted/30'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <div className='inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary'>
              Trending Now
            </div>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
              Popular This Week
            </h2>
            <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
              See what everyone is reading and join the conversation.
            </p>
          </div>
        </div>
        <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 md:grid-cols-4'>
          {trendingBooks.books.map((book) => (
            <BookCard
              key={book.edition.id}
              book={book.work}
              edition={book.edition}
              authors={book.authors}
              tags={book.tags}
            />
          ))}
        </div>
        <div className='flex justify-center mt-8'>
          <Link href='/books'>
            <Button variant='outline' size='lg' className='gap-1.5'>
              View All Trending Books
              <ArrowRight className='h-4 w-4' />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
