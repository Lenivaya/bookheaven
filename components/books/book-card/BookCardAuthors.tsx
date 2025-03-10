import { Author } from '@/db/schema'
import { ClientAuthorsInteraction } from './ClientAuthorsInteraction'

export function BookCardAuthors({ authors }: { authors: Author[] }) {
  return <ClientAuthorsInteraction authors={authors} />
}
