import { getAuthors } from '@/app/actions/authors.actions'
import { getTags } from '@/app/actions/tags.actions'
import { getBook, upsertBook } from '@/app/actions/books.actions'
import { isNone } from '@/lib/types'
import { notFound } from 'next/navigation'
import { BookForm } from './BookForm'

interface BookPageProps {
  searchParams: Promise<{
    id: string
  }>
}

export default async function BookPage({ searchParams }: BookPageProps) {
  const { id } = await searchParams

  // Fetch the book if we're editing
  const book = id ? await getBook(id) : null

  // Fetch available authors and tags for the form
  const [authors, tags] = await Promise.all([
    getAuthors({ limit: 1000, offset: 0 }),
    getTags()
  ])

  const handleSubmit = async (data: any) => {
    'use server'
    return upsertBook(data, id)
  }

  if (id && isNone(book)) {
    notFound()
  }

  return (
    <div className='container mx-auto py-10 mt-20'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-2xl font-bold mb-8'>
          {book ? 'Edit Book' : 'Create New Book'}
        </h1>
        <BookForm
          initialData={book ?? undefined}
          availableAuthors={authors.authors}
          availableTags={tags.tags}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
