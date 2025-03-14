import { describe, it, expect } from 'vitest'
import { mergeIf, mergeManyIfs, type ConditionallyMergedObject } from './index'

describe('mergeIf', () => {
  it('should return the default object when predicate is false', () => {
    type TestObj = { a?: number; b?: number; c?: number }
    const defaultObj: TestObj = { a: 1, b: 2 }
    const objToMerge: TestObj = { b: 3, c: 4 }

    const result = mergeIf(false, defaultObj, objToMerge)

    expect(result).toEqual(defaultObj)
    // Ensure we didn't mutate the original object
    expect(result).toBe(defaultObj)
  })

  it('should merge objects when predicate is true', () => {
    type TestObj = { a?: number; b?: number; c?: number }
    const defaultObj: TestObj = { a: 1, b: 2 }
    const objToMerge: TestObj = { b: 3, c: 4 }

    const result = mergeIf(true, defaultObj, objToMerge)

    expect(result).toEqual({ a: 1, b: 3, c: 4 })
    // Ensure we didn't mutate the original objects
    expect(result).not.toBe(defaultObj)
    expect(result).not.toBe(objToMerge)
  })

  it('should handle empty objects', () => {
    type TestObj = { a?: number }
    const defaultObj: TestObj = {}
    const objToMerge: TestObj = { a: 1 }

    expect(mergeIf(true, defaultObj, objToMerge)).toEqual({ a: 1 })
    expect(mergeIf(false, defaultObj, objToMerge)).toEqual({})
  })
})

describe('mergeManyIfs', () => {
  it('should apply no merges when all predicates are false', () => {
    type TestObj = { a?: number; b?: number; c?: number; d?: number }
    const startingObj: TestObj = { a: 1, b: 2 }
    const conditionalObjects: Array<ConditionallyMergedObject<TestObj>> = [
      [false, { c: 3 }],
      [false, { d: 4 }]
    ]

    const result = mergeManyIfs(startingObj, conditionalObjects)

    expect(result).toEqual({ a: 1, b: 2 })
    // Ensure we didn't return the original object
    expect(result).not.toBe(startingObj)
  })

  it('should apply all merges when all predicates are true', () => {
    type TestObj = { a?: number; b?: number; c?: number }
    const startingObj: TestObj = { a: 1, b: 2 }
    const conditionalObjects: Array<ConditionallyMergedObject<TestObj>> = [
      [true, { b: 3 }],
      [true, { c: 4 }]
    ]

    const result = mergeManyIfs(startingObj, conditionalObjects)

    expect(result).toEqual({ a: 1, b: 3, c: 4 })
  })

  it('should apply merges selectively based on predicates', () => {
    type TestObj = { a?: number; b?: number; c?: number; d?: number }
    const startingObj: TestObj = { a: 1, b: 2 }
    const conditionalObjects: Array<ConditionallyMergedObject<TestObj>> = [
      [true, { b: 3 }],
      [false, { c: 4 }],
      [true, { d: 5 }]
    ]

    const result = mergeManyIfs(startingObj, conditionalObjects)

    expect(result).toEqual({ a: 1, b: 3, d: 5 })
  })

  it('should handle empty starting object', () => {
    type TestObj = { a?: number; b?: number }
    const startingObj: TestObj = {}
    const conditionalObjects: Array<ConditionallyMergedObject<TestObj>> = [
      [true, { a: 1 }],
      [true, { b: 2 }]
    ]

    const result = mergeManyIfs(startingObj, conditionalObjects)

    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('should handle empty conditional objects array', () => {
    type TestObj = { a: number; b: number }
    const startingObj: TestObj = { a: 1, b: 2 }

    const result = mergeManyIfs(startingObj, [])

    expect(result).toEqual({ a: 1, b: 2 })
    // Ensure we didn't return the original object
    expect(result).not.toBe(startingObj)
  })

  it('should apply merges in the correct order', () => {
    type TestObj = { a?: number; b?: number; c?: number }
    const startingObj: TestObj = { a: 1 }
    const conditionalObjects: Array<ConditionallyMergedObject<TestObj>> = [
      [true, { a: 2, b: 2 }],
      [true, { a: 3, c: 3 }]
    ]

    const result = mergeManyIfs(startingObj, conditionalObjects)

    // The last merge should override previous values
    expect(result).toEqual({ a: 3, b: 2, c: 3 })
  })
})
