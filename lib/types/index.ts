export type Option<T> = T | null | undefined
export type Nullable<T> = T | null

export function isSome<T>(value: Option<T>): value is T {
  return value !== null && value !== undefined
}

export function isNone<T>(value: Option<T>): value is null | undefined {
  return value === null || value === undefined
}

export function isEmptyOrWhitespace(value: Option<string>) {
  return value === '' || value === null || value === undefined
}
