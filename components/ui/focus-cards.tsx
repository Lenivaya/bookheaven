'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Link } from 'next-view-transitions'

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    card: any
    index: number
    hovered: number | null
    setHovered: React.Dispatch<React.SetStateAction<number | null>>
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        'rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full transition-all duration-300 ease-out',
        hovered !== null && hovered !== index && 'blur-sm scale-[0.98]'
      )}
    >
      <Image
        src={card.src}
        alt={card.title}
        fill
        className='object-cover absolute inset-0'
        sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
        quality={75}
        loading='lazy'
      />
      {/* Always visible label for small touch devices */}
      <div className='absolute inset-x-0 bottom-0 bg-black/70 py-3 px-4 md:hidden'>
        <div className='text-lg font-medium text-white'>{card.title}</div>
      </div>
      {/* Hover overlay for larger devices */}
      <div
        className={cn(
          'absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300 hidden md:flex',
          hovered === index ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className='text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200'>
          {card.title}
        </div>
      </div>
    </div>
  )
)

Card.displayName = 'Card'

type Card = {
  title: string
  src: string
  id: string
}

export function FocusCards({ cards }: { cards: Card[] }) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto md:px-8 w-full'>
      {cards.map((card, index) => (
        <Link href={`/books?tags=${card.id}`} key={card.title}>
          <Card
            key={card.title}
            card={card}
            index={index}
            hovered={hovered}
            setHovered={setHovered}
          />
        </Link>
      ))}
    </div>
  )
}
