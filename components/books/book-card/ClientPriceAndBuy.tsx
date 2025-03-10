import { BookEdition, BookWork } from '@/db/schema'
import { BookCardBuyButton } from './BookCardBuyButton'
import { BookPriceDisplay } from './BookPriceDisplay'

interface ClientPriceAndBuyProps {
  price: string
  salePrice: string | null
  isOnSale: boolean
  bookEdition: BookEdition
  bookWork: BookWork
}

export function ClientPriceAndBuy({
  price,
  salePrice,
  isOnSale,
  bookEdition,
  bookWork
}: ClientPriceAndBuyProps) {
  return (
    <>
      <BookPriceDisplay
        price={price}
        salePrice={salePrice}
        isOnSale={isOnSale}
      />
      <BookCardBuyButton bookEdition={bookEdition} bookWork={bookWork} />
    </>
  )
}
