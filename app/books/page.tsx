import { getBooks } from '@/app/actions/books.action'
import BookCard from '@/components/books/book-card/BookCard'

export default async function BooksPage() {
  const books = await getBooks()

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-3xl font-bold mb-6'>Books Collection</h1>

      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {books.map((book) => (
            <BookCard
              key={book.work.id}
              book={book.work}
              edition={book.edition}
              authors={book.authors}
              tags={book.tags}
            />
          ))}
        </div>
      )}
    </div>
  )
}
