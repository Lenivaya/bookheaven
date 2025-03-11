import { BookEdition, BookWork } from '@/db/schema'
import { Product } from 'use-shopping-cart/core'

const convertToCents = (price: string) => {
  return Math.round(Number(price) * 100)
}

export function getProductFromBookEdition(
  bookEdition: BookEdition,
  bookWork: BookWork
): Product {
  return {
    id: bookEdition.id,
    price_id: bookEdition.id,
    sku: bookEdition.id,
    name: bookWork.title,
    price: convertToCents(bookEdition.price),
    currency: 'USD',
    image: bookEdition.thumbnailUrl!,
    description: bookWork.description!,
    product_data: {
      name: bookWork.title,
      description: bookWork.description,
      metadata: {
        // Extra
        format: bookEdition.format,
        language: bookEdition.language,
        isbn: bookEdition.isbn,
        publisher: bookEdition.publisher,
        publicationYear: bookWork.writingCompletedAt?.getFullYear()
      }
    }
  }
}
