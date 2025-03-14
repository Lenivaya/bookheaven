import { describe, it, expect } from 'vitest'
import { cn, formatCurrency } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('cn (className utility)', () => {
    it('combines class names correctly', () => {
      // Test with simple strings
      expect(cn('class1', 'class2')).toBe('class1 class2')

      // Test with conditional classes
      expect(cn('base-class', true && 'conditional-class')).toBe(
        'base-class conditional-class'
      )
      expect(cn('base-class', false && 'conditional-class')).toBe('base-class')

      // Test with undefined values
      expect(cn('base-class', undefined, 'another-class')).toBe(
        'base-class another-class'
      )

      // Test with array of classes
      expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3')

      // Test with object syntax
      expect(cn('base-class', { active: true, disabled: false })).toBe(
        'base-class active'
      )
    })

    it('handles tailwind class conflicts correctly', () => {
      // Test that later classes override earlier ones with the same utility
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
      expect(cn('p-2 m-2', 'p-4')).toBe('m-2 p-4')

      // Test with conditional overrides
      expect(cn('text-sm', true && 'text-lg')).toBe('text-lg')
    })
  })

  describe('formatCurrency', () => {
    it('formats currency values correctly with default USD', () => {
      expect(formatCurrency(0)).toBe('$0.00')
      expect(formatCurrency(1)).toBe('$1.00')
      expect(formatCurrency(1.5)).toBe('$1.50')
      expect(formatCurrency(1000)).toBe('$1,000.00')
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
      expect(formatCurrency(1000000)).toBe('$1,000,000.00')
    })

    it('formats currency values with specified currency', () => {
      expect(formatCurrency(100, 'EUR')).toBe('€100.00')
      expect(formatCurrency(100, 'GBP')).toBe('£100.00')
      expect(formatCurrency(100, 'JPY')).toBe('¥100.00')
    })

    it('handles negative values correctly', () => {
      expect(formatCurrency(-100)).toBe('-$100.00')
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56')
    })

    it('rounds to two decimal places', () => {
      expect(formatCurrency(1.2345)).toBe('$1.23')
      expect(formatCurrency(1.235)).toBe('$1.24') // Tests rounding
    })
  })
})
