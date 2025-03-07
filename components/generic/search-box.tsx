import { Search, X, Keyboard } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useCallback, useState, useRef, useMemo, memo } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { useHotkeys } from 'react-hotkeys-hook'

/**
 * Props for the SearchBox component
 * @interface SearchBoxProps
 */
interface SearchBoxProps {
  /**
   * Placeholder text to display when the search box is empty
   */
  placeholder?: string
  /**
   * Additional CSS classes to apply to the search box container
   */
  className?: string
  /**
   * Additional CSS classes to apply to the input element
   */
  inputClassName?: string
  /**
   * Callback function triggered when the search value changes
   * @param value The current search value
   */
  onSearch?: (value: string) => void
  /**
   * Debounce time in milliseconds for the search callback
   * @default 300
   */
  debounceMs?: number
  /**
   * Initial value for the search box
   */
  defaultValue?: string
  /**
   * Whether to show the clear button when there is text
   * @default true
   */
  showClear?: boolean
  /**
   * Size of the search and clear icons
   * @default 18
   */
  iconSize?: number
  /**
   * Whether the search box is disabled
   * @default false
   */
  disabled?: boolean
  /**
   * Enable Ctrl+K hotkey to focus the search box
   * @default false
   */
  enableHotkey?: boolean
  /**
   * Custom hotkey combination (e.g., 'ctrl+k', 'cmd+k', 'shift+/')
   * @default 'ctrl+k'
   */
  hotkey?: string
}

/**
 * A reusable search box component with debounced search functionality using usehooks-ts
 *
 * @example
 * ```tsx
 * <SearchBox
 *   placeholder="Search items..."
 *   onSearch={(value) => console.log('Searching for:', value)}
 *   debounceMs={500}
 *   enableHotkey
 * />
 * ```
 */
const SearchBoxComponent = ({
  placeholder = 'Search...',
  className,
  inputClassName,
  onSearch,
  debounceMs = 300,
  defaultValue = '',
  showClear = true,
  iconSize = 18,
  disabled = false,
  enableHotkey = false,
  hotkey = 'ctrl+k'
}: SearchBoxProps) => {
  const [value, setValue] = useState(defaultValue)
  const [isHotkeyPressed, setIsHotkeyPressed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Create a stable debounced search function that won't change on re-renders
  const debouncedSearch = useDebounceCallback(
    useCallback(
      (searchValue: string) => {
        onSearch?.(searchValue)
      },
      [onSearch]
    ),
    debounceMs
  )

  // Memoize the change handler to prevent recreation on each render
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setValue(newValue)
      debouncedSearch(newValue)
    },
    [debouncedSearch]
  )

  // Memoize the clear handler to prevent recreation on each render
  const handleClear = useCallback(() => {
    setValue('')
    debouncedSearch('')
    inputRef.current?.focus()
  }, [debouncedSearch])

  // Memoize the hotkey handler to prevent recreation on each render
  const handleHotkey = useCallback(() => {
    if (enableHotkey && !disabled) {
      setIsHotkeyPressed(true)
      inputRef.current?.focus()
      // Reset the pressed state after animation
      setTimeout(() => setIsHotkeyPressed(false), 200)
    }
  }, [enableHotkey, disabled])

  // Set up hotkeys with memoized handler
  useHotkeys(
    hotkey,
    handleHotkey,
    {
      preventDefault: true,
      enabled: enableHotkey && !disabled
    },
    [handleHotkey, enableHotkey, disabled]
  )

  // Memoize the hotkey display to avoid recalculation on every render
  const hotkeyDisplay = useMemo(() => {
    return hotkey
      .replace('ctrl', '⌃')
      .replace('cmd', '⌘')
      .replace('shift', '⇧')
      .replace('alt', '⌥')
      .toUpperCase()
  }, [hotkey])

  // Memoize container class to avoid recalculation on every render
  const containerClass = useMemo(() => {
    return cn(
      'group relative flex w-full items-center transition-all duration-300',
      'hover:shadow-md focus-within:shadow-md',
      'rounded-lg bg-background',
      isHotkeyPressed && 'ring-2 ring-primary ring-offset-2',
      className
    )
  }, [className, isHotkeyPressed])

  // Memoize input class to avoid recalculation on every render
  const inputClass = useMemo(() => {
    return cn(
      'border-0 pl-10 pr-9 text-center shadow-none',
      'placeholder:text-muted-foreground/60',
      'focus-visible:ring-2 focus-visible:ring-offset-0',
      'transition-all duration-200',
      inputClassName
    )
  }, [inputClassName])

  // Memoize clear button class to avoid recalculation on every render
  const clearButtonClass = useMemo(() => {
    return cn(
      'absolute right-3',
      'text-muted-foreground/60 hover:text-foreground',
      'transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-ring focus-visible:ring-offset-2',
      'rounded-full p-0.5'
    )
  }, [])

  // Memoize hotkey indicator class to avoid recalculation on every render
  const hotkeyIndicatorClass = useMemo(() => {
    return cn(
      'pointer-events-none absolute right-3 flex items-center gap-1',
      'text-xs text-muted-foreground/40',
      value && 'hidden'
    )
  }, [value])

  return (
    <div className={containerClass}>
      <Search
        size={iconSize}
        className={cn(
          'absolute left-3 text-muted-foreground/60',
          'transition-colors duration-200',
          'group-hover:text-muted-foreground',
          'group-focus-within:text-primary'
        )}
      />
      <Input
        ref={inputRef}
        type='text'
        value={value}
        onChange={handleChange}
        className={inputClass}
        placeholder={placeholder}
        disabled={disabled}
      />
      {showClear && value && (
        <button
          onClick={handleClear}
          className={clearButtonClass}
          disabled={disabled}
          type='button'
          aria-label='Clear search'
        >
          <X
            size={iconSize}
            className='transition-transform duration-200 hover:scale-110'
          />
        </button>
      )}
      {enableHotkey && !disabled && (
        <div className={hotkeyIndicatorClass}>
          <Keyboard size={14} />
          <span>{hotkeyDisplay}</span>
        </div>
      )}
    </div>
  )
}

// Export a memoized version of the component to prevent unnecessary re-renders
export const SearchBox = memo(SearchBoxComponent)
