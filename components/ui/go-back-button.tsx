'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface GoBackButtonProps {
  href?: string
}

export function GoBackButton({ href }: GoBackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
    router.refresh()
  }

  return (
    <Button
      type='button'
      variant='outline'
      onClick={handleClick}
      className='gap-2'
    >
      <ArrowLeft className='h-4 w-4' />
      Go Back
    </Button>
  )
}
