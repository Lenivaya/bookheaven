import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { NavLink } from '@/components/layout/navbar/NavLink'

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

describe('NavLink', () => {
  it('renders with children', () => {
    // Mock the usePathname to return a non-matching path
    vi.mocked(usePathname).mockReturnValue('/different-path')

    render(
      <NavLink href='/test-path'>
        <span>Test Link</span>
      </NavLink>
    )

    // Check if the link text is rendered
    expect(screen.getByText('Test Link')).toBeInTheDocument()
  })

  it('applies active styles when path matches', () => {
    // Mock the usePathname to return a matching path
    vi.mocked(usePathname).mockReturnValue('/test-path')

    const { container } = render(
      <NavLink href='/test-path'>
        <span>Test Link</span>
      </NavLink>
    )

    // Check if the active class is applied
    const link = container.querySelector('a')
    expect(link).toHaveClass('bg-primary/15')
    expect(link).toHaveClass('text-primary')
  })

  it('applies inactive styles when path does not match', () => {
    // Mock the usePathname to return a non-matching path
    vi.mocked(usePathname).mockReturnValue('/different-path')

    const { container } = render(
      <NavLink href='/test-path'>
        <span>Test Link</span>
      </NavLink>
    )

    // Check if the inactive class is applied
    const link = container.querySelector('a')
    expect(link).toHaveClass('text-muted-foreground')
    expect(link).not.toHaveClass('bg-primary/15')
  })

  it('applies extra active class when provided and path matches', () => {
    // Mock the usePathname to return a matching path
    vi.mocked(usePathname).mockReturnValue('/test-path')

    const { container } = render(
      <NavLink href='/test-path' extraActiveClass='extra-test-class'>
        <span>Test Link</span>
      </NavLink>
    )

    // Check if the extra active class is applied
    const link = container.querySelector('a')
    expect(link).toHaveClass('extra-test-class')
  })
})
