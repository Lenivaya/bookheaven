/**
 * Conditionally merges two objects based on a predicate.
 *
 * @param predicate - Boolean condition determining whether to merge
 * @param defaultObject - Base object that will be returned if predicate is false
 * @param objectToMerge - Object to merge into defaultObject if predicate is true
 * @returns The defaultObject if predicate is false, otherwise returns defaultObject merged with objectToMerge
 * @template T - Type of both objects, must extend object
 */
export const mergeIf = <T extends object>(
  predicate: boolean,
  defaultObject: T,
  objectToMerge: T
) => (predicate ? { ...defaultObject, ...objectToMerge } : defaultObject)

/**
 * Tuple type representing a conditional object merge operation
 * First element is the predicate boolean, second is the object to potentially merge
 *
 * @template T - Type of the object, must extend object
 */
export type ConditionallyMergedObject<T extends object> = [boolean, T]

/**
 * Merges multiple objects conditionally into a starting object
 *
 * @param startingObject - Initial object to merge into
 * @param conditionalObjects - Array of tuples containing predicates and objects to potentially merge
 * @returns A new object with all conditional merges applied
 * @template T - Type of all objects involved, must extend object
 */
export const mergeManyIfs = <T extends object>(
  startingObject: T,
  conditionalObjects: ReadonlyArray<ConditionallyMergedObject<T>>
) => ({
  ...conditionalObjects.reduce(
    (acc, [predicate, objectToMerge]) => mergeIf(predicate, acc, objectToMerge),
    startingObject
  )
})
