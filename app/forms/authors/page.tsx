import {
  getAuthor,
  updateAuthor,
  upsertAuthor
} from '@/app/actions/authors.actions'
import { isNone, isSome } from '@/lib/types'
import { notFound } from 'next/navigation'
import { AuthorForm } from './AuthorForm'

interface AuthorPageProps {
  searchParams: Promise<{
    id: string
  }>
}

export default async function AuthorPage({ searchParams }: AuthorPageProps) {
  const { id } = await searchParams

  const author = await getAuthor(id)

  const handleSubmit = async (data: any) => {
    'use server'

    if (isSome(author)) {
      return updateAuthor(author.id, data)
    } else {
      return upsertAuthor(data)
    }
  }

  return (
    <div className='container mx-auto py-10 mt-20'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-2xl font-bold mb-8'>
          {author ? 'Edit Author' : 'Create New Author'}
        </h1>
        <AuthorForm initialData={author ?? undefined} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
