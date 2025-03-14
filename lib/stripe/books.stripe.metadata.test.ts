import { BookEdition, BookWork } from '@/db/schema'
import { describe, expect, it } from 'vitest'
import {
  convertToCents,
  convertToDollars,
  getProductFromBookEdition
} from './books.stripe.metadata'

describe('Stripe Book Metadata Utilities', () => {
  describe('convertToCents', () => {
    it('should convert dollar string to cents integer', () => {
      expect(convertToCents('10.99')).toBe(1099)
      expect(convertToCents('0')).toBe(0)
      expect(convertToCents('1.5')).toBe(150)
      expect(convertToCents('100')).toBe(10000)
    })
  })

  describe('convertToDollars', () => {
    it('should convert cents integer to dollar number', () => {
      expect(convertToDollars(1099)).toBe(10.99)
      expect(convertToDollars(0)).toBe(0)
      expect(convertToDollars(150)).toBe(1.5)
      expect(convertToDollars(10000)).toBe(100)
    })
  })

  describe('getProductFromBookEdition', () => {
    it('should convert book edition and work to a Stripe product', () => {
      // Create mock book edition and work objects
      const mockBookEdition: Partial<BookEdition> = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        price: '24.99',
        format: 'hardcover',
        language: 'en',
        isbn: '9781234567897',
        publisher: 'Test Publisher',
        thumbnailUrl: 'https://example.com/book-cover.jpg'
      }

      const mockBookWork: Partial<BookWork> = {
        id: '223e4567-e89b-12d3-a456-426614174001',
        title: 'Test Book Title',
        description: 'This is a test book description',
        writingCompletedAt: new Date('2023-01-01')
      }

      // Get the product
      const product = getProductFromBookEdition(
        mockBookEdition as BookEdition,
        mockBookWork as BookWork
      )

      // Verify the product properties
      expect(product.id).toBe(mockBookEdition.id)
      expect(product.price_id).toBe(mockBookEdition.id)
      expect(product.sku).toBe(mockBookEdition.id)
      expect(product.name).toBe(mockBookWork.title)
      expect(product.price).toBe(2499) // 24.99 converted to cents
      expect(product.currency).toBe('USD')
      expect(product.image).toBe(mockBookEdition.thumbnailUrl)
      expect(product.description).toBe(mockBookWork.description)

      // Type assertion for product_data to avoid TypeScript errors
      type ProductData = {
        name: string
        description?: string
        metadata: {
          dbId: string
          format?: string
          language?: string
          isbn?: string
          publisher?: string
          publicationYear?: number
        }
      }

      // Verify product_data
      const productData = (product as any).product_data as ProductData
      expect(productData.name).toBe(mockBookWork.title)
      expect(productData.description).toBe(mockBookWork.description)

      // Verify metadata
      expect(productData.metadata.dbId).toBe(mockBookEdition.id)
      expect(productData.metadata.format).toBe(mockBookEdition.format)
      expect(productData.metadata.language).toBe(mockBookEdition.language)
      expect(productData.metadata.isbn).toBe(mockBookEdition.isbn)
      expect(productData.metadata.publisher).toBe(mockBookEdition.publisher)
      expect(productData.metadata.publicationYear).toBe(2023)
    })

    it('should handle missing optional fields gracefully', () => {
      // Create mock book edition and work objects with minimal fields
      const mockBookEdition: Partial<BookEdition> = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        price: '19.99',
        thumbnailUrl: 'https://example.com/book-cover.jpg'
      }

      const mockBookWork: Partial<BookWork> = {
        id: '223e4567-e89b-12d3-a456-426614174001',
        title: 'Minimal Book'
      }

      // Get the product
      const product = getProductFromBookEdition(
        mockBookEdition as BookEdition,
        mockBookWork as BookWork
      )

      // Verify the product properties
      expect(product.id).toBe(mockBookEdition.id)
      expect(product.name).toBe(mockBookWork.title)
      expect(product.price).toBe(1999) // 19.99 converted to cents
      expect(product.currency).toBe('USD')
      expect(product.image).toBe(mockBookEdition.thumbnailUrl)

      // Verify metadata for undefined fields
      const productData = (product as any).product_data as {
        metadata: Record<string, unknown>
      }

      expect(productData.metadata.publicationYear).toBeUndefined()
      expect(productData.metadata.format).toBeUndefined()
      expect(productData.metadata.language).toBeUndefined()
      expect(productData.metadata.isbn).toBeUndefined()
      expect(productData.metadata.publisher).toBeUndefined()
    })
  })
})
