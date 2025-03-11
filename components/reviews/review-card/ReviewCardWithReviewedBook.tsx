import { getBookById } from '@/app/actions/books.actions'
import { BookCard } from '@/components/books/book-card'
import { Card, CardContent } from '@/components/ui/card'
import { ReviewCard, ReviewCardProps } from './ReviewCard'
import { isNone } from '@/lib/types'

export async function ReviewCardWithReviewedBook(props: ReviewCardProps) {
  const book = await getBookById(props.review.editionId)
  if (isNone(book)) return null

  return (
    <Card>
      <CardContent className='flex flex-col gap-4'>
        <BookCard
          book={book!.work}
          edition={book!.edition}
          authors={book!.authors}
          tags={book!.tags}
        />
        <ReviewCard {...props} />
      </CardContent>
    </Card>
  )
}
