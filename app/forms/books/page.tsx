import { getAuthors } from '@/app/actions/authors.actions'
import { getTags } from '@/app/actions/tags.actions'
import { upsertBook } from '@/app/actions/books.actions'
import { BookForm, BookFormData } from './BookForm'

export default async function NewBookPage() {
  // Fetch available authors and tags for the form
  const [authors, tags] = await Promise.all([
    getAuthors({ limit: 1000, offset: 0 }),
    getTags()
  ])

  const handleSubmit = async (data: BookFormData) => {
    'use server'
    // @ts-expect-error - <idc>
    return upsertBook(data)
  }

  return (
    <div className='container mx-auto py-10 mt-20'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-2xl font-bold mb-8'>Create New Book</h1>
        <BookForm
          availableAuthors={authors.authors}
          availableTags={tags.tags}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
