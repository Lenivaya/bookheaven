'use client'

import { BookCardBuyButton } from './BookCardBuyButton'
import { BookPriceDisplay } from './BookPriceDisplay'

interface ClientPriceAndBuyProps {
  price: string
  salePrice: string | null
  isOnSale: boolean
}

export function ClientPriceAndBuy({
  price,
  salePrice,
  isOnSale
}: ClientPriceAndBuyProps) {
  return (
    <>
      <BookPriceDisplay
        price={price}
        salePrice={salePrice}
        isOnSale={isOnSale}
      />
      <BookCardBuyButton />
    </>
  )
}
