const AVAILABLE_SYSTEM_SHELVES = [
  'Want to Read',
  'Currently Reading',
  'Read',
  'Did Not Finish'
] as const

export type DefaultShelves = (typeof AVAILABLE_SYSTEM_SHELVES)[number]

export const DEFAULT_SYSTEM_SHELVES =
  AVAILABLE_SYSTEM_SHELVES as unknown as DefaultShelves[]
