import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { NavbarUser } from '@/components/layout/navbar/NavbarUser'

// Create counters for unique component IDs
let signedInCounter = 0
let signedOutCounter = 0
let signInButtonCounter = 0
let signUpButtonCounter = 0
let userButtonCounter = 0
let dashboardCounter = 0
let buttonCounter = 0

// Mock the Clerk components
vi.mock('@clerk/nextjs', () => ({
  SignInButton: ({ children }: any) => {
    signInButtonCounter++
    return (
      <div data-testid={`sign-in-button-${signInButtonCounter}`}>
        {children}
      </div>
    )
  },
  SignUpButton: ({ children }: any) => {
    signUpButtonCounter++
    return (
      <div data-testid={`sign-up-button-${signUpButtonCounter}`}>
        {children}
      </div>
    )
  },
  SignedIn: ({ children }: any) => {
    signedInCounter++
    return <div data-testid={`signed-in-${signedInCounter}`}>{children}</div>
  },
  SignedOut: ({ children }: any) => {
    signedOutCounter++
    return <div data-testid={`signed-out-${signedOutCounter}`}>{children}</div>
  },
  UserButton: (props: any) => {
    userButtonCounter++
    return (
      <div data-testid={`user-button-${userButtonCounter}`}>User Button</div>
    )
  }
}))

// Mock the NavbarDashboard component
vi.mock('@/components/layout/navbar/NavbarDashboard', () => ({
  NavbarDashboard: () => {
    dashboardCounter++
    return (
      <div data-testid={`navbar-dashboard-${dashboardCounter}`}>Dashboard</div>
    )
  }
}))

// Mock the Button component
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, className, variant, size }: any) => {
    buttonCounter++
    return (
      <button
        data-testid={`button-${variant}-${size}-${buttonCounter}`}
        className={className}
      >
        {children}
      </button>
    )
  }
}))

describe('NavbarUser', () => {
  beforeEach(() => {
    // Reset all counters before each test
    signedInCounter = 0
    signedOutCounter = 0
    signInButtonCounter = 0
    signUpButtonCounter = 0
    userButtonCounter = 0
    dashboardCounter = 0
    buttonCounter = 0
  })

  it('renders sign in and sign up buttons for signed out users', () => {
    const { container } = render(<NavbarUser />)

    // Check if the signed out section is rendered
    expect(
      container.querySelector('[data-testid^="signed-out-"]')
    ).toBeInTheDocument()

    // Check if the sign in and sign up buttons are rendered
    expect(
      container.querySelector('[data-testid^="sign-in-button-"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-testid^="sign-up-button-"]')
    ).toBeInTheDocument()

    // Check if the button text is rendered
    expect(screen.getByText('Sign in')).toBeInTheDocument()
    expect(screen.getByText('Sign up')).toBeInTheDocument()
  })

  it('renders user button and dashboard for signed in users', () => {
    const { container } = render(<NavbarUser />)

    // Check if the signed in section is rendered
    expect(
      container.querySelector('[data-testid^="signed-in-"]')
    ).toBeInTheDocument()

    // Check if the user button and dashboard are rendered
    expect(
      container.querySelector('[data-testid^="user-button-"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-testid^="navbar-dashboard-"]')
    ).toBeInTheDocument()
  })
})
