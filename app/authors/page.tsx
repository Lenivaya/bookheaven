import { getAuthors } from '../actions/authors.actions'

export default async function AuthorsPage() {
  const authors = await getAuthors()
  console.log(authors)
  return <div>Authors</div>
}
