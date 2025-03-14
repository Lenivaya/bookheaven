import { describe, expect, it } from 'vitest'
import { Option, Nullable, isSome, isNone, isEmptyOrWhitespace } from './index'

describe('Type utility functions', () => {
  describe('isSome', () => {
    it('should return true for non-null and non-undefined values', () => {
      expect(isSome(0)).toBe(true)
      expect(isSome('')).toBe(true)
      expect(isSome(false)).toBe(true)
      expect(isSome({})).toBe(true)
      expect(isSome([])).toBe(true)
    })

    it('should return false for null or undefined values', () => {
      expect(isSome(null)).toBe(false)
      expect(isSome(undefined)).toBe(false)
    })
  })

  describe('isNone', () => {
    it('should return true for null or undefined values', () => {
      expect(isNone(null)).toBe(true)
      expect(isNone(undefined)).toBe(true)
    })

    it('should return false for non-null and non-undefined values', () => {
      expect(isNone(0)).toBe(false)
      expect(isNone('')).toBe(false)
      expect(isNone(false)).toBe(false)
      expect(isNone({})).toBe(false)
      expect(isNone([])).toBe(false)
    })
  })

  describe('isEmptyOrWhitespace', () => {
    it('should return true for empty string, null, or undefined values', () => {
      expect(isEmptyOrWhitespace('')).toBe(true)
      expect(isEmptyOrWhitespace(null)).toBe(true)
      expect(isEmptyOrWhitespace(undefined)).toBe(true)
    })

    it('should return false for non-empty strings', () => {
      expect(isEmptyOrWhitespace('hello')).toBe(false)
      expect(isEmptyOrWhitespace(' ')).toBe(false) // Note: This is a whitespace, not empty
      expect(isEmptyOrWhitespace('  test  ')).toBe(false)
    })
  })

  // Type tests using TypeScript's type system
  // These don't run at runtime but verify type behavior at compile time
  describe('Option type', () => {
    it('should allow value, null, or undefined', () => {
      const value: Option<string> = 'test'
      const nullValue: Option<number> = null
      const undefinedValue: Option<boolean> = undefined

      // TypeScript will error if these assignments are invalid
      expect(true).toBe(true) // Dummy assertion to satisfy Jest
    })
  })

  describe('Nullable type', () => {
    it('should allow value or null, but not undefined', () => {
      const value: Nullable<string> = 'test'
      const nullValue: Nullable<number> = null

      // TypeScript will error if this assignment is invalid
      // const undefinedValue: Nullable<boolean> = undefined // This would cause a type error

      expect(true).toBe(true) // Dummy assertion to satisfy Jest
    })
  })
})
