import { BookEdition, BookWork } from '@/db/schema'
import { Product } from 'use-shopping-cart/core'

export function getProductFromBookEdition(
  bookEdition: BookEdition,
  bookWork: BookWork
): Product {
  return {
    id: bookEdition.id,
    price_id: bookEdition.id,
    sku: bookEdition.id,
    name: bookWork.title,
    price: Number(bookEdition.price),
    currency: 'USD',
    image: bookEdition.thumbnailUrl!,
    description: bookWork.description!,
    product_data: {
      name: bookWork.title,
      description: bookWork.description
    }
  }
}
