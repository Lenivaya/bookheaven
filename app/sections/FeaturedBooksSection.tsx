import { getBooks } from '@/app/actions/books.actions'
import BookCard from '@/components/books/book-card/BookCard'

export default async function FeaturedBooksSection() {
  // Fetch data for this section independently
  const featuredBooks = await getBooks({
    limit: 8,
    offset: 0
  })

  return (
    <section className='w-full py-12 md:py-24 bg-background'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <div className='inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary'>
              Featured Books
            </div>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
              Handpicked for You
            </h2>
            <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
              Discover our selection of must-read books curated by our literary
              experts.
            </p>
          </div>
        </div>
        <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {featuredBooks.books.map((book) => (
            <BookCard
              key={book.edition.id}
              book={book.work}
              edition={book.edition}
              authors={book.authors}
              tags={book.tags}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
