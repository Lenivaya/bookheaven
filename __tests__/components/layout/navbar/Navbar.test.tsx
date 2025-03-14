import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { Navbar } from '@/components/layout/navbar/Navbar'

// Create counters for each component type to ensure unique IDs
let navLinkCounter = 0
let navbarCartCounter = 0
let navbarUserCounter = 0
let mobileNavCounter = 0
let separatorCounter = 0

// Mock the child components
vi.mock('@/components/layout/navbar/MobileNavigation', () => ({
  MobileNavigation: () => {
    mobileNavCounter++
    return (
      <div data-testid={`mobile-navigation-${mobileNavCounter}`}>
        Mobile Nav
      </div>
    )
  }
}))

vi.mock('@/components/layout/navbar/NavbarCart', () => ({
  NavbarCart: () => {
    navbarCartCounter++
    return <div data-testid={`navbar-cart-${navbarCartCounter}`}>Cart</div>
  }
}))

vi.mock('@/components/layout/navbar/NavbarUser', () => ({
  NavbarUser: () => {
    navbarUserCounter++
    return <div data-testid={`navbar-user-${navbarUserCounter}`}>User</div>
  }
}))

vi.mock('@/components/layout/navbar/NavLink', () => ({
  NavLink: ({ href, children }: any) => {
    navLinkCounter++
    const linkId = `nav-link-${navLinkCounter}`
    return (
      <a href={href} data-testid={linkId} data-nav-path={href}>
        {children}
      </a>
    )
  }
}))

// Mock the UI components
vi.mock('@/components/ui/separator', () => ({
  Separator: ({ orientation, className }: any) => {
    separatorCounter++
    return (
      <div
        data-testid={`separator-${separatorCounter}`}
        data-orientation={orientation}
        className={className}
      />
    )
  }
}))

// Mock the next-view-transitions module
vi.mock('next-view-transitions', () => ({
  Link: ({ href, className, children, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  )
}))

describe('Navbar', () => {
  beforeEach(() => {
    // Reset all counters before each test
    navLinkCounter = 0
    navbarCartCounter = 0
    navbarUserCounter = 0
    mobileNavCounter = 0
    separatorCounter = 0
  })

  it('renders the navbar with logo', () => {
    render(<Navbar />)

    // Check if the logo text is rendered
    expect(screen.getByText('BookHeaven')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    const { container } = render(<Navbar />)

    // Get all navigation links by their data-testid attribute
    const navLinks = container.querySelectorAll('[data-testid^="nav-link-"]')

    // Check if we have the expected number of navigation links
    expect(navLinks.length).toBe(3)

    // Check if the links have the correct paths
    expect(navLinks[0]).toHaveAttribute('data-nav-path', '/books')
    expect(navLinks[1]).toHaveAttribute('data-nav-path', '/authors')
    expect(navLinks[2]).toHaveAttribute('data-nav-path', '/book-shelves')
  })

  it('renders user interface components', () => {
    const { container } = render(<Navbar />)

    // Check if the UI components are rendered using querySelector to find the first matching element
    expect(
      container.querySelector('[data-testid^="navbar-cart-"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-testid^="navbar-user-"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-testid^="mobile-navigation-"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-testid^="separator-"]')
    ).toBeInTheDocument()
  })
})
