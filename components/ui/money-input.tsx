'use client'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { forwardRef, useState } from 'react'

interface MoneyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (value: number | null) => void
  error?: boolean
  currency?: string
}

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ className, onChange, error, currency = '$', ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(() => {
      const value = props.value
      if (typeof value === 'number') {
        return value.toFixed(2)
      }
      return ''
    })

    const [isFocused, setIsFocused] = useState(false)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value

      // Allow empty input
      if (!value) {
        setDisplayValue('')
        onChange?.(null)
        return
      }

      // Remove all non-digit characters except decimal point
      const cleanValue = value.replace(/[^\d.]/g, '')

      // Ensure only one decimal point
      const parts = cleanValue.split('.')
      if (parts.length > 2) return

      // Limit decimal places to 2
      if (parts[1] && parts[1].length > 2) return

      // Format the number
      const numericValue = parseFloat(cleanValue)
      if (!isNaN(numericValue)) {
        // Only update display value if it's a valid number
        setDisplayValue(cleanValue)
        onChange?.(numericValue)
      }
    }

    // Format on blur to ensure consistent display
    const handleBlur = () => {
      setIsFocused(false)
      if (displayValue) {
        const numericValue = parseFloat(displayValue)
        if (!isNaN(numericValue)) {
          setDisplayValue(numericValue.toFixed(2))
        }
      }
    }

    const handleFocus = () => {
      setIsFocused(true)
    }

    return (
      <div className='relative group'>
        <span
          className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200',
            isFocused ? 'text-primary' : 'text-muted-foreground',
            error && 'text-destructive'
          )}
        >
          {currency}
        </span>
        <Input
          {...props}
          ref={ref}
          type='text'
          inputMode='decimal'
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className={cn(
            'pl-7 transition-shadow duration-200',
            error && 'border-destructive',
            isFocused &&
              'ring-2 ring-ring ring-offset-2 ring-offset-background',
            className
          )}
        />
      </div>
    )
  }
)

MoneyInput.displayName = 'MoneyInput'
