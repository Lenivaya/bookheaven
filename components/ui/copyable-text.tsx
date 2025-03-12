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
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
        <span
          className={cn('inline-flex items-center gap-1.5 group', className)}
        >
          <span className='truncate max-w-[180px]'>{displayText || text}</span>
          <TooltipTrigger asChild>
            <button
              type='button'
              onClick={handleCopy}
              className={cn(
                'flex-shrink-0 transition-colors',
                iconClassName,
                copied ? 'text-green-500' : 'text-zinc-500 hover:text-zinc-300'
              )}
              aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
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
        </span>
      </Tooltip>
    </TooltipProvider>
  )
}
