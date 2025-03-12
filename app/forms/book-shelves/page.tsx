import { notFound } from 'next/navigation'
import { getShelfByIdWithBooks } from '@/app/actions/bookShelves.actions'
import { BookShelvesForm } from '@/components/bookshelves/form/BookShelvesForm'

interface BookShelvesFormPageProps {
  searchParams: Promise<{
    id?: string
  }>
}

export default async function BookShelvesFormPage({
  searchParams
}: BookShelvesFormPageProps) {
  const params = await searchParams
  const shelfId = params.id

  let shelf
  if (shelfId) {
    shelf = await getShelfByIdWithBooks(shelfId)
    if (!shelf) {
      return notFound()
    }
  }

  return (
    <div className='min-h-[calc(100vh-4rem)] w-full flex items-center justify-center p-4'>
      <div className='w-full max-w-2xl bg-card rounded-lg border shadow-sm p-6'>
        <BookShelvesForm shelf={shelf} />
      </div>
    </div>
  )
}
