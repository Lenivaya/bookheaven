'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

interface CopyableTextProps {
  text: string
  displayText?: string
  className?: string
  iconClassName?: string
}

export function CopyableText({
  text,
  displayText,
  className,
  iconClassName
}: CopyableTextProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 group cursor-pointer',
        className
      )}
      onClick={handleCopy}
    >
      <span className='truncate max-w-[180px]'>{displayText || text}</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type='button'
              className={cn(
                'flex-shrink-0 transition-colors',
                iconClassName,
                copied
                  ? 'text-green-500'
                  : 'text-zinc-500 group-hover:text-zinc-300'
              )}
              aria-label='Copy to clipboard'
            >
              {copied ? (
                <Check className='h-3.5 w-3.5' />
              ) : (
                <Copy className='h-3.5 w-3.5' />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side='top' className='text-xs'>
            {copied ? 'Copied!' : 'Copy to clipboard'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
