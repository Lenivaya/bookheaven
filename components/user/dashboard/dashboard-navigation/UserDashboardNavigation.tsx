'use client'

import { cn } from '@/lib/utils'
import { Link } from 'next-view-transitions'

import { usePathname } from 'next/navigation'

const DASHBOARD_SECTIONS = [
  {
    name: 'Dashboard',
    href: '/user/dashboard'
  },
  {
    name: 'Orders',
    href: '/user/dashboard/orders'
  },
  {
    name: 'Liked books',
    href: '/user/dashboard/liked-books'
  },
  {
    name: 'Book shelves',
    href: '/user/dashboard/book-shelves'
  },
  {
    name: 'Reviews',
    href: '/user/dashboard/reviews'
  }
]

interface UserDashboardNavigationProps {
  className?: string
}

export function UserDashboardNavigation({
  className
}: UserDashboardNavigationProps) {
  const pathname = usePathname()

  return (
    <nav className={cn('space-y-1', className)}>
      {DASHBOARD_SECTIONS.map((section) => {
        const isActive = pathname === section.href

        return (
          <Link
            key={section.href}
            href={section.href}
            className={cn(
              'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <span className='truncate'>{section.name}</span>
            {isActive && (
              <div className='ml-auto h-1.5 w-1.5 rounded-full bg-primary' />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
