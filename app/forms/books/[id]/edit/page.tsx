import { getAuthors } from '@/app/actions/authors.actions'
import { getTags } from '@/app/actions/tags.actions'
import { getBook, upsertBook } from '@/app/actions/books.actions'
import { isNone } from '@/lib/types'
import { notFound } from 'next/navigation'
import { BookForm, BookFormData } from '../../BookForm'

interface EditBookPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const { id } = await params

  // Fetch the book
  const book = await getBook(id)

  // Fetch available authors and tags for the form
  const [authors, tags] = await Promise.all([
    getAuthors({ limit: 1000, offset: 0 }),
    getTags()
  ])

  const handleSubmit = async (data: BookFormData) => {
    'use server'
    // @ts-expect-error - <idc>
    return upsertBook(data, id)
  }

  if (isNone(book)) {
    notFound()
  }

  return (
    <div className='container mx-auto py-10 mt-20'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-2xl font-bold mb-8'>Edit Book</h1>
        <BookForm
          initialData={book}
          availableAuthors={authors.authors}
          availableTags={tags.tags}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
