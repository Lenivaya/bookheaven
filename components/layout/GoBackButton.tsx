'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

interface GoBackButtonProps {
  text?: string
  onClick?: () => void
}

export function GoBackButton({ text = 'Go back', onClick }: GoBackButtonProps) {
  const router = useRouter()

  const handleClick = useCallback(() => {
    onClick?.()
    router.back()
  }, [onClick, router])

  return (
    <div
      className='group text-muted-foreground hover:text-primary flex cursor-pointer items-center gap-2 transition-colors'
      onClick={handleClick}
    >
      <ArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-1' />
      {text}
    </div>
  )
}
