import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { MobileNavigation } from '@/components/layout/navbar/MobileNavigation'

// Create counters for unique component IDs
let buttonCounter = 0
let sheetCounter = 0
let sheetTriggerCounter = 0
let sheetContentCounter = 0
let sheetHeaderCounter = 0
let sheetTitleCounter = 0
let linkCounter = 0
let menuIconCounter = 0
let bookIconCounter = 0
let usersIconCounter = 0
let libraryIconCounter = 0

// Mock the next/navigation module
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/books')
}))

// Mock the next-view-transitions module
vi.mock('next-view-transitions', () => ({
  Link: ({ href, className, children, onClick, ...props }: any) => {
    linkCounter++
    return (
      <a
        href={href}
        className={className}
        onClick={onClick}
        data-testid={`link-${linkCounter}`}
        {...props}
      >
        {children}
      </a>
    )
  }
}))

// Mock the UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    className,
    variant,
    size,
    'aria-label': ariaLabel,
    asChild,
    ...props
  }: any) => {
    buttonCounter++
    if (asChild && children) {
      return children
    }
    return (
      <button
        data-testid={`button-${variant}-${size}-${buttonCounter}`}
        className={className}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </button>
    )
  }
}))

vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children, open, onOpenChange }: any) => {
    sheetCounter++
    return (
      <div
        data-testid={`sheet-${sheetCounter}`}
        data-open={open}
        onClick={() => onOpenChange && onOpenChange(!open)}
      >
        {children}
      </div>
    )
  },
  SheetTrigger: ({ children, asChild }: any) => {
    sheetTriggerCounter++
    if (asChild && children) {
      return children
    }
    return (
      <div data-testid={`sheet-trigger-${sheetTriggerCounter}`}>{children}</div>
    )
  },
  SheetContent: ({ children, side, className }: any) => {
    sheetContentCounter++
    return (
      <div
        data-testid={`sheet-content-${sheetContentCounter}`}
        data-side={side}
        className={className}
      >
        {children}
      </div>
    )
  },
  SheetHeader: ({ children, className }: any) => {
    sheetHeaderCounter++
    return (
      <div
        data-testid={`sheet-header-${sheetHeaderCounter}`}
        className={className}
      >
        {children}
      </div>
    )
  },
  SheetTitle: ({ children, className }: any) => {
    sheetTitleCounter++
    return (
      <div
        data-testid={`sheet-title-${sheetTitleCounter}`}
        className={className}
      >
        {children}
      </div>
    )
  }
}))

// Mock the Lucide icons
vi.mock('lucide-react', () => ({
  Menu: () => {
    menuIconCounter++
    return <div data-testid={`menu-icon-${menuIconCounter}`}>Menu</div>
  },
  BookOpenIcon: () => {
    bookIconCounter++
    return <div data-testid={`book-icon-${bookIconCounter}`}>Book</div>
  },
  Users: () => {
    usersIconCounter++
    return <div data-testid={`users-icon-${usersIconCounter}`}>Users</div>
  },
  Library: () => {
    libraryIconCounter++
    return <div data-testid={`library-icon-${libraryIconCounter}`}>Library</div>
  }
}))

// Import the mocked usePathname
import { usePathname } from 'next/navigation'

describe('MobileNavigation', () => {
  beforeEach(() => {
    // Reset all counters before each test
    buttonCounter = 0
    sheetCounter = 0
    sheetTriggerCounter = 0
    sheetContentCounter = 0
    sheetHeaderCounter = 0
    sheetTitleCounter = 0
    linkCounter = 0
    menuIconCounter = 0
    bookIconCounter = 0
    usersIconCounter = 0
    libraryIconCounter = 0

    // Reset mocks
    vi.clearAllMocks()
  })

  it('renders the mobile navigation button', () => {
    const { container } = render(<MobileNavigation />)

    // Check if the menu button is rendered
    const menuButton = container.querySelector(
      '[data-testid^="button-ghost-icon"]'
    )
    expect(menuButton).toBeInTheDocument()

    // Check if the menu icon is rendered
    const menuIcon = container.querySelector('[data-testid^="menu-icon"]')
    expect(menuIcon).toBeInTheDocument()
  })

  it('renders the navigation links in the sheet content', () => {
    const { container } = render(<MobileNavigation />)

    // Check if the sheet content is rendered
    const sheetContent = container.querySelector(
      '[data-testid^="sheet-content"]'
    )
    expect(sheetContent).toBeInTheDocument()

    // Check if the navigation title is rendered (using querySelector to find the specific element)
    const sheetTitle = container.querySelector('[data-testid^="sheet-title"]')
    expect(sheetTitle).toBeInTheDocument()
    expect(sheetTitle).toHaveTextContent('Navigation')

    // Check if the navigation links are rendered
    const links = screen.getAllByRole('link')
    const booksLink = links.find((link) => link.textContent?.includes('Book'))
    const authorsLink = links.find((link) =>
      link.textContent?.includes('Authors')
    )
    const shelvesLink = links.find((link) =>
      link.textContent?.includes('Shelves')
    )

    expect(booksLink).toBeInTheDocument()
    expect(authorsLink).toBeInTheDocument()
    expect(shelvesLink).toBeInTheDocument()

    // Check if the icons are rendered
    const bookIcon = container.querySelector('[data-testid^="book-icon"]')
    const usersIcon = container.querySelector('[data-testid^="users-icon"]')
    const libraryIcon = container.querySelector('[data-testid^="library-icon"]')

    expect(bookIcon).toBeInTheDocument()
    expect(usersIcon).toBeInTheDocument()
    expect(libraryIcon).toBeInTheDocument()
  })

  it('shows the current year in the footer', () => {
    const { container } = render(<MobileNavigation />)

    // Check if the current year is displayed in the footer
    const currentYear = new Date().getFullYear().toString()

    // Find the footer element specifically
    const footerElement = container.querySelector('.mt-auto.p-4.border-t')
    expect(footerElement).toBeInTheDocument()

    // Check if the footer contains the copyright text
    if (footerElement) {
      expect(footerElement).toHaveTextContent(`© ${currentYear} BookHeaven`)
    }
  })
})
