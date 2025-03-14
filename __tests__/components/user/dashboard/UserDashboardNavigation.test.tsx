import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { UserDashboardNavigation } from '@/components/user/dashboard/dashboard-navigation/UserDashboardNavigation'

// Mock the next/navigation module
vi.mock('next/navigation', () => ({
  usePathname: vi.fn()
}))

// Mock the next-view-transitions module
vi.mock('next-view-transitions', () => ({
  Link: ({ href, className, children, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  )
}))

// Import the mocked usePathname
import { usePathname } from 'next/navigation'

// Clean up after each test
afterEach(() => {
  cleanup()
  vi.resetAllMocks()
})

describe('UserDashboardNavigation', () => {
  it('renders all navigation items', () => {
    // Mock the usePathname to return a specific path
    vi.mocked(usePathname).mockReturnValue('/user/dashboard')

    render(<UserDashboardNavigation />)

    // Check if all navigation items are rendered
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Orders')).toBeInTheDocument()
    expect(screen.getByText('Liked books')).toBeInTheDocument()
    expect(screen.getByText('Book shelves')).toBeInTheDocument()
    expect(screen.getByText('Reviews')).toBeInTheDocument()
  })

  it('highlights the active navigation item', () => {
    // Mock the usePathname to return a specific path
    vi.mocked(usePathname).mockReturnValue('/user/dashboard/orders')

    render(<UserDashboardNavigation />)

    // Get all navigation links
    const links = screen.getAllByRole('link')

    // Find the Orders link (should be active)
    const ordersLink = links.find((link) =>
      link.textContent?.includes('Orders')
    )

    // Check if the Orders link has the active class
    expect(ordersLink).toHaveClass('bg-primary/10')
    expect(ordersLink).toHaveClass('text-primary')

    // Check that other links don't have the active class
    const dashboardLink = links.find((link) =>
      link.textContent?.includes('Dashboard')
    )
    expect(dashboardLink).not.toHaveClass('bg-primary/10')
    expect(dashboardLink).toHaveClass('text-muted-foreground')
  })

  it('applies custom className when provided', () => {
    vi.mocked(usePathname).mockReturnValue('/user/dashboard')

    const customClass = 'custom-test-class'
    render(<UserDashboardNavigation className={customClass} />)

    // Get the nav element
    const navElement = screen.getByRole('navigation')

    // Check if the custom class is applied
    expect(navElement).toHaveClass(customClass)
  })
})
