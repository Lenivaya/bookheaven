import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { NavbarDashboard } from '@/components/layout/navbar/NavbarDashboard'

// Create counters for unique component IDs
let buttonCounter = 0
let navLinkCounter = 0
let iconCounter = 0

// Mock the next/navigation module
vi.mock('next/navigation', () => ({
  usePathname: vi.fn()
}))

// Mock the NavLink component
vi.mock('@/components/layout/navbar/NavLink', () => ({
  NavLink: ({ href, children, extraActiveClass }: any) => {
    navLinkCounter++
    return (
      <a
        href={href}
        data-testid={`nav-link-${navLinkCounter}`}
        data-extra-active-class={extraActiveClass}
      >
        {children}
      </a>
    )
  }
}))

// Mock the Button component
vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    className,
    variant,
    size,
    'aria-label': ariaLabel
  }: any) => {
    buttonCounter++
    return (
      <button
        data-testid={`button-${variant}-${size}-${buttonCounter}`}
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </button>
    )
  }
}))

// Mock the Lucide icon
vi.mock('lucide-react', () => ({
  LayoutDashboard: () => {
    iconCounter++
    return <div data-testid={`dashboard-icon-${iconCounter}`}>Dashboard</div>
  }
}))

// Import the mocked usePathname
import { usePathname } from 'next/navigation'

describe('NavbarDashboard', () => {
  beforeEach(() => {
    // Reset all counters before each test
    buttonCounter = 0
    navLinkCounter = 0
    iconCounter = 0

    // Reset mocks
    vi.clearAllMocks()
  })

  it('renders the dashboard link with correct href', () => {
    const { container } = render(<NavbarDashboard />)

    // Check if the NavLink is rendered with the correct href
    const navLink = container.querySelector('[data-testid^="nav-link-"]')
    expect(navLink).toBeInTheDocument()
    expect(navLink).toHaveAttribute('href', '/user/dashboard')
  })

  it('passes the correct extraActiveClass to NavLink', () => {
    const { container } = render(<NavbarDashboard />)

    // Check if the NavLink has the correct extraActiveClass
    const navLink = container.querySelector('[data-testid^="nav-link-"]')
    expect(navLink).toHaveAttribute(
      'data-extra-active-class',
      'text-primary bg-primary/30 rounded-md'
    )
  })

  it('renders the dashboard button with correct aria-label', () => {
    const { container } = render(<NavbarDashboard />)

    // Check if the Button is rendered with the correct aria-label
    const button = container.querySelector('[data-testid^="button-ghost-sm-"]')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'Dashboard')
  })

  it('renders the dashboard icon', () => {
    const { container } = render(<NavbarDashboard />)

    // Check if the dashboard icon is rendered using querySelector to find the first matching element
    const icon = container.querySelector('[data-testid^="dashboard-icon-"]')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveTextContent('Dashboard')
  })
})
